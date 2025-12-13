export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const validation = await readValidatedBody(event, z.object({
    coupleDate: z.number().optional().nullable(),
    public: z.boolean().optional()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_bond_data" });

  const body = validation.data;

  await db.update(tables.bonds).set({
    coupleDate: body.coupleDate,
    public: body.public,
    updatedAt: Date.now()
  }).where(and(
    eq(tables.bonds.code, user.bond.code),
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  )).run();
});
