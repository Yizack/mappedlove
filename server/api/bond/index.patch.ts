export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const body = await readValidatedBody(event, z.object({
    coupleDate: z.number().optional().nullable(),
    public: z.boolean().optional()
  }).safeParse);

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_bond_data" });

  const form = body.data;

  const DB = useDB();
  await DB.update(tables.bonds).set({
    coupleDate: form.coupleDate,
    public: form.public,
    updatedAt: Date.now()
  }).where(and(
    eq(tables.bonds.code, user.bond.code),
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  )).run();
});
