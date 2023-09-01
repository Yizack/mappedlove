export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];

export const getMonth = (date: Date, format: "numeric" | "2-digit" | "long" | "short" | "narrow" = "long") => {
  return date.toLocaleString(t("lang_code"), { month: format });
};

export const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  return years;
});

export const untilNextAnniversary = (date: Date): string => {
  const today = new Date();
  const nextAnniversary = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (nextAnniversary < today) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
  }
  const diff = nextAnniversary.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const months = nextAnniversary.getMonth() - today.getMonth() + (12 * (nextAnniversary.getFullYear() - today.getFullYear()));
  const years = nextAnniversary.getFullYear() - today.getFullYear();

  if (years === 1 && months === 12 && days === 366) {
    return t("today_exclamation");
  }

  if (years && months === 12) {
    return `${t("in")} ${years} ${ years > 1 ? t("years").toLowerCase() : t("year").toLowerCase()}`;
  }

  if (months && days > 30) {
    return `${t("in")} ${months} ${ months > 1 ? t("months").toLowerCase() : t("month").toLowerCase()}`;
  }

  return `${t("in")} ${days} ${ days > 1 ? t("days").toLowerCase() : t("day").toLowerCase()}`;
};


export const getTogetherFor = (date?: Date | null) => {
  if (!date) return {};

  const today = new Date();

  let years = today.getFullYear() - date.getFullYear();
  let months = today.getMonth() - date.getMonth();
  let days = today.getDate() - date.getDate();


  if (days < 0) {
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days };
}
