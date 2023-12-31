import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveUser> => {
  const { user } = await requireUserSession(event);
  const { secure } = useRuntimeConfig(event);
  const { current_password, new_password } = await readBody(event);

  const DB = useDb();
  const update = await DB.update(tables.users).set({
    password: hash(new_password, secure.salt),
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, Number(user.id)), eq(tables.users.password, hash(current_password, secure.salt)))).returning().get();

  if (!update) throw createError({ statusCode: 404, message: "password_error" });
  return update;
});
