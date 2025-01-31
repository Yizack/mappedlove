import { useSession, type H3Event, type SessionConfig } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullish = async (event: H3Event, data: UserSession, config?: Partial<SessionConfig>) => {
  data.maxAge = config?.maxAge ?? data.maxAge;
  const session = await useSession<UserSession>(event, {
    ...useRuntimeConfig(event).session,
    maxAge: data.maxAge
  });
  await session.update(data);
  return session.data;
};
