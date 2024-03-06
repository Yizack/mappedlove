import { useCompiler } from "#vue-email";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) : Promise<{ email: string }> => {
  const body = await readValidatedBody(event, (body) => z.object({
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

  const template = await useCompiler("accountVerify.vue", {
    props: {
      lang: "en",
      verifyLink: `${url}/verify/${encodeURIComponent(btoa(email))}/${code}`
    }
  });

  if (!template) {
    throw createError({
      statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "email_template_not_found"
    });
  }

  const html = template.html;

  await sendMail(config, {
    to: { email, name },
    subject: "Verify your email address",
    html
  });

  return { email };
});
