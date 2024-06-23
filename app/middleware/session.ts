export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession() as MappedLoveSessionComposable;

  if (!loggedIn.value) return navigateTo("/login", { replace: true });

  const userBonded = user.value?.bond?.bonded;

  if (to.name !== "app" && to.name !== "app-settings" && !userBonded) {
    if (import.meta.client && !userBonded) {
      const { $toasts } = useNuxtApp();
      $toasts.add({ message: t("need_bond"), success: false });
    }
    return navigateTo("/app", { replace: true });
  }
});
