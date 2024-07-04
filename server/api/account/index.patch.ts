export default defineEventHandler(async (event): Promise<MappedLoveUser> => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, body => z.object({
    name: z.string().optional(),
    country: z.string().nullable().optional(),
    birthDate: z.number().nullable().optional(),
    showAvatar: z.boolean().optional()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_user_data" });

  const form = body.data;

  if (form.name !== undefined && !form.name) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "name_required" });

  const DB = useDB();
  const update = await DB.update(tables.users).set({
    name: form.name,
    country: form.country,
    birthDate: form.birthDate,
    showAvatar: form.showAvatar !== undefined ? Number(form.showAvatar) : undefined,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, Number(user.id))).returning({
    id: tables.users.id,
    email: tables.users.email,
    name: tables.users.name,
    country: tables.users.country,
    birthDate: tables.users.birthDate,
    showAvatar: tables.users.showAvatar,
    confirmed: tables.users.confirmed,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  await setUserSessionNullable(event, { user: { ...user, ...update } });

  return update;
});
