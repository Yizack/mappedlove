import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMarker[]> => {
  const { user } = await requireUserSession(event);
  const { oldArrange, newArrange } : { oldArrange: [any], newArrange: [any] } = await readBody(event);
  const DB = useDb();

  const rearranged: MappedLoveMarker[] = [];
  for (const [index, marker] of oldArrange.entries()) {
    if (marker.order === newArrange[index].order) continue;
    const update = await DB.update(tables.markers).set({ order: newArrange[index].order }).where(and(eq(tables.markers.id, marker.id), eq(tables.markers.bond, user.bond.id))).returning().get();
    if (!update) continue;
    rearranged.push(update);
  }
  return rearranged;
});
