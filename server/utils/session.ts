import { useSession } from "h3";
import type { H3Event, SessionConfig } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullish = async (event: H3Event, data: Omit<UserSession, "id">, config?: Partial<SessionConfig>) => {
  const currentData = await getUserSession(event);
  const runtimeConfig = useRuntimeConfig(event);

  const session = await useSession<UserSession>(event, {
    ...runtimeConfig.session,
    ...config,
    maxAge: config?.maxAge ?? currentData.maxAge ?? runtimeConfig.session.maxAge
  });

  if (config?.maxAge) data.maxAge = config?.maxAge;
  await session.update(data);
  return session.data;
};
