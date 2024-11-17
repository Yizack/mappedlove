import { useSession, type H3Event } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullable = async (event: H3Event, data: UserSession) => {
  const session = await useSession<UserSession>(event, useRuntimeConfig(event).session);
  await session.update(data);
  return session.data;
};
