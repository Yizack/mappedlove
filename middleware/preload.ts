export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return;
  }

  const banners = [
    "fields.jpg",
    "heart.jpg"
  ];

  banners.forEach((banner) => {
    const img = new Image();
    img.src = `/images/illustrations/${banner}`;
  });
});
