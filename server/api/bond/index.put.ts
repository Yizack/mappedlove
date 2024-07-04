export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  const DB = useDB();
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bondExists) throw createError({ statusCode: ErrorCode.CONFLICT, message: "bond_exists" });

  const body = await readValidatedBody(event, body => z.object({
    code: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_code_required" });

  const bond = await DB.update(tables.bonds).set({
    partner1: sql`COALESCE(${tables.bonds.partner1}, ${user.id})`,
    partner2: sql`COALESCE(${tables.bonds.partner2}, ${user.id})`,
    bonded: 1, // true
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, body.data.code))).returning().get();

  if (!bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "partner_code_not_found" });

  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
