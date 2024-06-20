import Mustache from "mustache";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<{ email: string }> => {
  const body = await readValidatedBody(event, body => z.object({
    email: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "email_required" });

  const { email } = body.data;

  const config = useRuntimeConfig(event);
  const DB = useDb();
  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const fields = [user.id, user.email, user.updatedAt];
  const code = hash(fields.join(""), config.secure.salt);

  const { name } = user;
  const url = import.meta.dev ? SITE.dev : SITE.host;

  const html = Mustache.render(templates.accountVerify, {
    lang: "en",
    domain: SITE.domain,
    verifyLink: `${url}/verify/${encodeURIComponent(btoa(email))}/${code}`
  });

  await sendMail(config, {
    to: { email, name },
    subject: "Verify your email address",
    html
  });

  return { email };
});
