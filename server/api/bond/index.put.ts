import { eq, or, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  const DB = useDb();
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bondExists) throw createError({ statusCode: ErrorCode.CONFLICT, message: "bond_exists" });

  const body = await readValidatedBody(event, (body) => z.object({
    code: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_code_required" });

  const partner = partnerIdFromCode(body.data.code);

  const bond = await DB.update(tables.bonds).set({
    partner2: user.id,
    bonded: 1, // true
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, body.data.code), eq(tables.bonds.partner1, partner))).returning().get();
  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
