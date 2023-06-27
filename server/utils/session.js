export const _useSession = (event) => {
  const { session } = useRuntimeConfig(event);
  return useSession(event, session);
};

export const getUserSession = async (event) => {
  return (await _useSession(event)).data;
};

export const clearUserSession = async (event) => {
  const session = await _useSession(event);
  await session.clear();
};

export const setUserSession = async (event, data) => {
  const session = await _useSession(event);
  await session.update(data);
  return session.data;
};

export const requireUserSession = async (event) => {
  return await getUserSession(event).catch(() => {});
};
