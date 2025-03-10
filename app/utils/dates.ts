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

export const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  return years;
});

export const getUntilDate = (timestamp: number): string => {
  const today = new Date();
  const startMonth = today.getMonth();
  const startDay = today.getDate();

  const date = new Date(timestamp);
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

export const getTogetherFor = (timestamp: number | null) => {
  if (!timestamp) return null;
  const today = new Date();
  const date = new Date(timestamp);
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

export const formatDate = (time: number | null) => {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleString(t("lang_code"), { month: "long", day: "numeric", year: "numeric" });
};

export const timeOptions: Record<string, Intl.DateTimeFormatOptions & { locale?: string }> = {
  day: {
    day: "numeric"
  },
  monthName: {
    locale: t("lang_code"),
    month: "short"
  },
  full: {
    locale: t("lang_code"),
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }
};

export const datePickerOptions = computed(() => ({
  timestamp: {
    locale: useUserSession().user.value?.language,
    modelType: "timestamp",
    format: "yyyy-MM-dd",
    enableTimePicker: false,
    maxDate: new Date(),
    dark: import.meta.client && useColorMode().preference === "dark"
  }
} as const));
