export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const body = await readValidatedBody(event, body => z.object({
    coupleDate: z.number().optional().nullable(),
    public: z.number().optional()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_bond_data" });

  const form = body.data;

  const DB = useDB();
  const bond = await DB.update(tables.bonds).set({
    coupleDate: form.coupleDate,
    public: form.public,
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, user.bond.code), or(eq(tables.bonds.partner1, user.id), eq(tables.bonds.partner2, user.id)))).returning().get();

  await setUserSessionNullable(event, {
    user: {
      ...user,
      bond: {
        ...user.bond,
        coupleDate: bond.coupleDate,
        public: bond.public,
        updatedAt: bond.updatedAt
      }
    }
  });

  return bond;
});
