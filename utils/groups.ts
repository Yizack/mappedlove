export const groups = [
  {
    key: "places",
    icon: "solar:point-on-map-linear"
  },
  {
    key: "restaurants",
    icon: "ion:fast-food-outline"
  },
  {
    key: "hotels",
    icon: "solar:sleeping-linear"
  },
  {
    key: "events",
    icon: "solar:ticker-star-linear"
  },
  {
    key: "activities",
    icon: "solar:magic-stick-2-linear"
  },
  {
    key: "cities",
    icon: "solar:city-linear"
  },
  {
    key: "others",
    icon: "solar:ghost-smile-linear"
  }
].sort((a, b) => a.key.localeCompare(b.key));
