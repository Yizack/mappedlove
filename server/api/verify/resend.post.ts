// @ts-ignore
import Mustache from "mustache";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) : Promise<{ email: string }> => {
  const { email } = await readBody(event);
  const config = useRuntimeConfig(event);
  const DB = useDb();
  const user = await DB.select({
    name: tables.users.name,
    confirmCode: tables.users.confirmCode
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) throw createError({ statusCode: 404, message: "user_not_found" });

  const { name, confirmCode: token } = user;
  const url = process.dev ? "http://localhost:5173" : "https://mappedlove.com";

  const template_strings = {
    verify_link: `${url}/verify/${encodeURIComponent(btoa(email))}/${token}`
  };

  const html = Mustache.render(templates.verifyAccount, template_strings);

  await sendMail(config, {
    to: { email, name },
    subject: "Verify your email address",
    html
  });

  return { email };
});
