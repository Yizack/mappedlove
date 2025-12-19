export default defineEventHandler(async (event): Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const validation = await readValidatedBody(event, z.object({
    lat: z.number(),
    lng: z.number(),
    group: z.number(),
    title: z.string(),
    description: z.string(),
    country: z.string().nullable().optional().transform(c => c?.toUpperCase())
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_marker_data" });

  const body = validation.data;

  const today = Date.now();

  const markers = await db.select({
    count: count(tables.markers.id)
  }).from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).get();

  if (!user.bond.premium && markers && markers.count >= Quota.FREE_MARKERS) throw createError({ status: ErrorCode.PAYMENT_REQUIRED, message: "max_markers" });

  const last = db.select({ order: tables.markers.order }).from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(desc(tables.markers.order)).limit(1);

  return db.insert(tables.markers).values({
    lat: body.lat,
    lng: body.lng,
    group: body.group,
    bond: user.bond.id,
    title: body.title,
    description: body.description,
    country: body.country,
    order: sql`COALESCE((${last}) + 1, 0)`,
    createdAt: today,
    updatedAt: today
  }).returning().get();
});
