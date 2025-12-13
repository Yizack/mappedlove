import { localization } from "~~/shared/utils/localization";

export default defineEventHandler(async (event): Promise<User> => {
  const { user } = await requireUserSession(event);

  const validation = await readValidatedBody(event, z.object({
    name: z.string().optional(),
    country: z.string().nullable().optional(),
    birthDate: z.number().nullable().optional(),
    showAvatar: z.boolean().optional(),
    language: z.enum(localization.getLocales().map(l => l.code) as [MappedLoveLocales]).optional()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_user_data" });

  const body = validation.data;

  if (body.name !== undefined && !body.name) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "name_required" });

  const update = await db.update(tables.users).set({
    name: body.name,
    country: body.country,
    birthDate: body.birthDate,
    showAvatar: body.showAvatar,
    language: body.language,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning({
    id: tables.users.id,
    email: tables.users.email,
    name: tables.users.name,
    country: tables.users.country,
    birthDate: tables.users.birthDate,
    showAvatar: tables.users.showAvatar,
    language: tables.users.language,
    confirmed: tables.users.confirmed,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const session = { user: { ...user, ...update } };
  await setUserSessionNullish(event, session);

  return update;
});
