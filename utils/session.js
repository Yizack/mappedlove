const useUserSessionState = () => useState("nuxt-session", () => ({}));

export const useUserSession = () => {
  const sessionState = useUserSessionState();
  return {
    loggedIn: computed(() => Boolean(sessionState.value.user)),
    user: computed(() => sessionState.value.user || null),
    data: sessionState,
    fetch,
    clear
  };
};

const fetch = async () => {
  useUserSessionState().value = await useRequestFetch()("/api/session").catch(() => ({}));
};

const clear = () => {
  useUserSessionState().value = {};
  return $fetch("/api/session", { method: "DELETE" });
};
