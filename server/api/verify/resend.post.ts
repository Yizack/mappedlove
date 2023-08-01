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
  sendMail(config, {
    to: { email, name },
    subject: "Verify your email address",
    html: `<p>Click <a href="${url}/verify/${encodeURIComponent(btoa(email))}/${token}">here</a> to verify your email.</p>`
  });

  return { email };
});
