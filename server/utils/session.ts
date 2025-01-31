import { useSession, type H3Event, type SessionConfig } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSession = async (event: H3Event, data: UserSession, config?: Partial<SessionConfig>) => {
  const maxAge = config?.maxAge ?? data.maxAge;
  const session = await useSession<UserSession>(event, {
    ...useRuntimeConfig(event).session,
    maxAge
  });
  if (config?.maxAge) {
    data.maxAge = maxAge;
  }
  await session.update(data);
  return session.data;
};
