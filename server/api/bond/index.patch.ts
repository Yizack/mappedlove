import { eq, and, or } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const body = await readValidatedBody(event, (body) => z.object({
    code: z.string().optional(),
    partner1: z.number().optional().nullable(),
    partner2: z.number().optional().nullable(),
    coupleDate: z.number().optional().nullable(),
    bonded: z.number().optional(),
    public: z.number().optional()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_bond_data" });

  const form = body.data;

  const DB = useDb();
  const bond = await DB.update(tables.bonds).set({
    id: user.bond.id,
    code: form.code,
    partner1: form.partner1,
    partner2: form.partner2,
    coupleDate: form.coupleDate,
    bonded: form.bonded,
    public: form.public,
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, user.bond.code), or(eq(tables.bonds.partner1, user.id), eq(tables.bonds.partner2, user.id)))).returning().get();
  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
