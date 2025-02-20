export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const session = await requireUserSession(event);

  const DB = useDB();
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, session.user.id),
      eq(tables.bonds.partner2, session.user.id)
    )
  ).get();

  if (bondExists) throw createError({ statusCode: ErrorCode.CONFLICT, message: "bond_exists" });

  const body = await readValidatedBody(event, z.object({
    code: z.string()
  }).safeParse);

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_code_required" });

  const bond = await DB.update(tables.bonds).set({
    partner1: sql`COALESCE(${tables.bonds.partner1}, ${session.user.id})`,
    partner2: sql`COALESCE(${tables.bonds.partner2}, ${session.user.id})`,
    bonded: true,
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, body.data.code))).returning().get();

  if (!bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "partner_code_not_found" });

  session.user = { ...session.user, bond };
  await setUserSessionNullish(event, session);
  return {
    ...bond,
    partners: await getPartners(event, DB, bond)
  };
});
