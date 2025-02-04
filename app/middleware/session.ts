export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    const redirect = to.fullPath === "/app" ? undefined : to.fullPath;
    return navigateTo({ name: "login", query: { redirect } }, { replace: true });
  }

  const userBonded = user.value?.bond?.bonded;

  if (to.name !== "app" && to.name !== "app-settings" && !userBonded) {
    if (import.meta.client && !userBonded) {
      const { $toasts } = useNuxtApp();
      $toasts.add({ message: t("need_bond"), success: false });
    }
    return navigateTo("/app", { replace: true });
  }
});
