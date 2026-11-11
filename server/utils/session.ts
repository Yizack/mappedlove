import { type RequestEvent, type SessionConfig, defineEventHandler, useRuntimeConfig, useSession } from "nuxt/server";
import type { H3Event } from "h3";
import type { UserSession } from "#auth-utils";

export const setUserSessionNullish = async (
  event: RequestEvent | H3Event,
  data: Omit<UserSession, "id">,
  config?: { maxAge?: number }
) => {
  const currentData = await getUserSession(event);
  const runtimeConfig = useRuntimeConfig();
  const sessionConfig = runtimeConfig.session as SessionConfig;
  const sessionEvent = toPortableEvent(event as RequestEvent);

  const session = await useSession<UserSession>(sessionEvent, {
    name: sessionConfig.name,
    maxAge: config?.maxAge ?? currentData.maxAge ?? sessionConfig.maxAge
  });

  if (config?.maxAge) data.maxAge = config?.maxAge;
  await session.update(data);
  return session.data;
};

const toPortableEvent = defineEventHandler(event => event);
