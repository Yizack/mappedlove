import type { H3Event } from "h3";
import { useSession } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullable = async (event: H3Event, data: UserSession) => {
  // @ts-expect-error session config
  const session = await useSession<UserSession>(event, useRuntimeConfig(event).session);
  await session.update(data);
  return session.data;
};
