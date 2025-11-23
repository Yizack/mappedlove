export default defineNuxtPlugin({
  parallel: true,
  dependsOn: ["toasts"],
  async setup () {
    const { $toasts } = useNuxtApp();

    globalThis.$fetch = $fetch.create({
      onResponseError: ({ response }) => {
        const message = response.status === 500 ? t("error_any") : t(response._data.message);
        $toasts.add({ message, success: false });
      }
    });
  }
});
