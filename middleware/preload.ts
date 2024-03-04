export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const banners = [
    "fields.jpg",
    "heart.jpg"
  ];

  for (const banner of banners) {
    const img = new Image();
    img.src = `/images/illustrations/${banner}`;
  }
});
