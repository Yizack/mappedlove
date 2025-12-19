export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partnerNumber = user.bond.partner1 === user.id ? 1 : 2;

  if (partnerNumber === 1 && user.bond.subscriptionId) {
    const config = useRuntimeConfig(event);
    const paddle = new Paddle(config.paddle.secret);
    const subscription = await paddle.getPaddleSubscription(user.bond.subscriptionId);
    if (subscription && subscription.data.status === "active" && subscription.data.scheduled_change?.action !== "cancel") throw createError({ status: ErrorCode.FORBIDDEN, message: "premium_owner_leaving" });
  }

  const update = await db.update(tables.bonds).set({
    [`partner${partnerNumber}`]: null,
    public: false,
    updatedAt: Date.now()
  }).where(eq(tables.bonds.id, user.bond.id)).returning().get();

  if (!update) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const session = { user: { ...user, bond: null } };
  await setUserSessionNullish(event, session);
});
