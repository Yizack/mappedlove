import { eq } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveUser> => {
  const { user } = await requireUserSession(event);

  const form = await readBody(event);

  if (form.name !== undefined && !form.name) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "name_required" });


  if (form.showAvatar !== undefined) {
    form.showAvatar = Number(form.showAvatar);
  }

  const DB = useDb();
  const update = await DB.update(tables.users).set({
    name: form.name,
    country: form.country,
    birthDate: form.birthDate,
    showAvatar: form.showAvatar,
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
    updatedAt: tables.users.updatedAt,
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  await setUserSession(event, { user: { ...user, ...form } });

  return update;
});
