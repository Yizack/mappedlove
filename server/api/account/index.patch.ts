import { eq } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveUser> => {
  const { user } = await requireUserSession(event);

  const userInfo = await readBody(event);

  if (userInfo.name !== undefined && !userInfo.name) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "name_required" });


  if (userInfo.showAvatar !== undefined) {
    userInfo.showAvatar = Number(userInfo.showAvatar);
  }

  const DB = useDb();
  const update = await DB.update(tables.users).set({
    showAvatar: userInfo.showAvatar,
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

  await setUserSession(event, { user: { ...user, ...userInfo } });

  return update;
});
