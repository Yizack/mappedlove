import Mustache from "mustache";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => z.object({
    email: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "email_required" });

  const form = body.data;

  const email = form.email.toLowerCase();

  const DB = useDb();
  const user = await DB.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, email)).returning().get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const config = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt];
  const code = hash(fields.join(""), config.secure.salt);

  const url = import.meta.dev ? SITE.dev : SITE.host;

  const html = Mustache.render(templates.accountRecovery, {
    lang: "en",
    domain: SITE.domain,
    recoveryLink: `${url}/recovery/${encodeURIComponent(btoa(user.email))}/${code}`
  });

  await sendMail(config, {
    to: { email, name: user.name },
    subject: "Account recovery",
    html
  });

  return { code };
});
