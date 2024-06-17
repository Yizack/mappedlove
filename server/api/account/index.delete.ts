import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.bond && user.bond.subscriptionId) {
    const subscription = await getPaddleSubscription(event, user.bond.subscriptionId);
    if (subscription && subscription.status === "active" && subscription.scheduled_change?.action !== "cancel") throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "premium_deleting" });
  }

  const DB = useDb();
  const deleted = await DB.delete(tables.users).where(eq(tables.users.id, user.id)).run();

  if (!deleted.changes) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  await clearUserSession(event);

  return { success: true };
});
