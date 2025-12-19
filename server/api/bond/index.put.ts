export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  const bondExists = await db.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bondExists) throw createError({ status: ErrorCode.CONFLICT, message: "bond_exists" });

  const validation = await readValidatedBody(event, z.object({
    code: z.string()
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "bond_code_required" });

  const body = validation.data;

  const bond = await db.update(tables.bonds).set({
    partner1: sql`COALESCE(${tables.bonds.partner1}, ${user.id})`,
    partner2: sql`COALESCE(${tables.bonds.partner2}, ${user.id})`,
    bonded: true,
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, body.code))).returning().get();

  if (!bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "partner_code_not_found" });

  const session = { user: { ...user, bond } };
  await setUserSessionNullish(event, session);

  return {
    ...bond,
    partners: await getPartners(event, bond)
  };
});
