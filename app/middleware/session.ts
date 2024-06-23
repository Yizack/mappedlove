export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession() as MappedLoveSessionComposable;
  if (!loggedIn.value) return navigateTo("/login", { replace: true });
  else if (to.name !== "app" && to.name !== "app-settings") {
    if (!user.value || !user.value.bond || !user.value.bond.bonded) {
      if (import.meta.client && (!user.value.bond || !user.value.bond.bonded)) {
        const { $toasts } = useNuxtApp();
        $toasts.add({ message: t("need_bond"), success: false });
      }
      return navigateTo("/app", { replace: true });
    }
  }
});
