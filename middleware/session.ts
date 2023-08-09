export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();
  if (!loggedIn.value) return navigateTo("/", { replace: true });
  else if (to.name !== "app-bond") {
    if (!user.value || !user.value.bond || !user.value.bond.bonded) {
      return navigateTo("/app/bond", { replace: true });
    }
  }
});
