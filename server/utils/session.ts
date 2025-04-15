import { type H3Event, type SessionConfig, useSession } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullish = async (event: H3Event, data: Omit<UserSession, "id">, config?: Partial<SessionConfig>) => {
  const finalConfig = {
    ...useRuntimeConfig(event).session,
    ...config
  };

  let session = await useSession<UserSession>(event, finalConfig);

  if (session.data.maxAge && config?.maxAge === undefined) {
    session = await useSession<UserSession>(event, {
      ...finalConfig,
      maxAge: session.data.maxAge as number
    });
  }

  if (config?.maxAge) data.maxAge = config?.maxAge;
  await session.update(data);
  return session.data;
};
