import { type SQL, inArray } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const body = await readValidatedBody(event, z.object({
    old: z.array(z.object({ id: z.number(), order: z.number() })),
    new: z.array(z.object({ id: z.number(), order: z.number() }))
  }).parse);

  const DB = useDB();
  const today = Date.now();

  const changes: { id: number, order: number }[] = [];
  for (const [index, marker] of body.old.entries()) {
    if (marker.order === body.new[index].order) continue;
    changes.push({ id: marker.id, order: body.new[index].order });
  }

  if (changes.length === 0) return;

  // Calculate batch size: each marker uses 3 params (2 in CASE + 1 in inArray)
  // Plus 2 fixed parameters (bond.id and updatedAt)
  const MAX_PARAMS = 100;
  const FIXED_PARAMS = 2;
  const PARAMS_PER_MARKER = 3;
  const BATCH_SIZE = Math.floor((MAX_PARAMS - FIXED_PARAMS) / PARAMS_PER_MARKER);

  for (let i = 0; i < changes.length; i += BATCH_SIZE) {
    const batch = changes.slice(i, i + BATCH_SIZE);

    const sqlChunks: SQL[] = [];
    sqlChunks.push(sql`(CASE`);

    for (const change of batch) {
      sqlChunks.push(sql`WHEN ${tables.markers.id} = ${change.id} THEN ${change.order}`);
    }

    sqlChunks.push(sql`END)`);
    const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

    event.waitUntil(
      DB.update(tables.markers).set({
        order: finalSql,
        updatedAt: today
      }).where(and(
        inArray(tables.markers.id, batch.map(item => item.id)),
        eq(tables.markers.bond, user.bond.id)
      )).run()
    );
  }
});
