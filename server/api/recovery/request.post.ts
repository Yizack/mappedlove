// @ts-ignore
import Mustache from "mustache";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const form = await readBody(event);
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
  const template_strings = {
    recovery_link: `${url}/recovery/${encodeURIComponent(btoa(user.email))}/${code}`
  };

  const html = Mustache.render(templates.accountRecovery, template_strings);

  await sendMail(config, {
    to: { email, name: user.name },
    subject: "Account recovery",
    html
  });

  return { code };
});
