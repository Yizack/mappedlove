import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveUser> => {
  const { user } = await requireUserSession(event);
  const { secure } = useRuntimeConfig(event);
  const body = await readValidatedBody(event, (body) => z.object({
    new_password: z.string()
  }).safeParse(body));

  if (!body.success || !isPasswordValid(body.data.new_password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const form = body.data;

  const DB = useDb();
  const update = await DB.update(tables.users).set({
    password: hash(form.new_password, secure.salt),
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, Number(user.id)), eq(tables.users.auth, 1))).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "password_error" });
  return update;
});
