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
  const startMonth = today.getMonth();
  const startDay = today.getDate();

  const endYear = date.getFullYear();
  const endMonth = date.getMonth();
  const endDay = date.getDate();

  let months = endMonth - startMonth;
  let days = endDay - startDay;

  if (days < 0) {
    months--;
    const prevMonthEndDate = new Date(endYear, endMonth, 0);
    days += prevMonthEndDate.getDate();
  }

  if (months < 0) {
    months += 12;
  }

  if (months === 0 && days === 0) {
    return t("today_exclamation");
  }

  let result = `${t("in")} `;

  if (months > 0) {
    result += `${months} ${months > 1 ? t("months").toLowerCase() : t("month").toLowerCase()}`;
    if (days > 0) {
      result += ", ";
    }
  }

  if (days > 0) {
    result += `${days} ${days > 1 ? t("days").toLowerCase() : t("day").toLowerCase()}`;
  }

  return result;
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
};
