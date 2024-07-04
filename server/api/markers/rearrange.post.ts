export default defineEventHandler(async (event): Promise<MappedLoveMarker[]> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { oldArrange, newArrange }: { oldArrange: MappedLoveMarker[], newArrange: MappedLoveMarker[] } = await readBody(event);
  const DB = useDB();

  const rearranged: MappedLoveMarker[] = [];
  const today = Date.now();

  for (const [index, marker] of oldArrange.entries()) {
    if (marker.order === newArrange[index]!.order) continue;
    const update = await DB.update(tables.markers).set({
      order: newArrange[index]!.order,
      updatedAt: today
    }).where(and(eq(tables.markers.id, marker.id), eq(tables.markers.bond, user.bond.id))).returning().get();
    if (!update) continue;
    rearranged.push(update);
  }
  return rearranged;
});
