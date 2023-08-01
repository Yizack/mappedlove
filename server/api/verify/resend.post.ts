import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) : Promise<{ email: string }> => {
  const { email } = await readBody(event);
  const config = useRuntimeConfig(event);
  const DB = useDb();
  const user = DB.select({
    name: tables.users.name,
    confirmCode: tables.users.confirmCode
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found"
    });
  }
  const { name, confirmCode: token } = user;
  const url = process.dev ? "http://localhost:5173" : "https://mappedlove.com";
  const mailed = await sendMail(config, {
    to: { email, name },
    subject: "Verify your email address",
    html: `Welcome to Mapped Love! to verify your email, click on the link below:<br/><br/><a href="${url}/verify/${encodeURIComponent(btoa(email))}/${token}">Verify Email</a><br/><br/>If you did not sign up for Mapped Love, please ignore this email.`
  });
  console.info(mailed);

  return { email };
});
