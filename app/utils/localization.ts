import en from "~/locales/en";
import es from "~/locales/es";

const strings = { en, es };

type Locale = keyof typeof strings;
type LocaleKeys = keyof typeof strings.en;

class Localization {
  constructor (private code: Locale = "en") {}

  get (key: LocaleKeys, values?: Record<string, unknown>): string {
    const text = strings[this.code]?.[key] ?? strings.en[key] ?? key;
    if (!values) return text;
    return Object.keys(values).reduce((acc, k) => acc.replace(new RegExp(`{{\\s*${k}\\s*}}`, "gi"), String(values[k])), text);
  }

  setLanguage (code: Locale = "en") {
    this.code = code;
  }

  getLocales () {
    return Object.keys(strings) as Locale[];
  }
}

export const localization = new Localization();

export const t = (key: LocaleKeys | (string & {}), values?: Record<string, unknown>) => {
  return localization.get(key as LocaleKeys, values);
};
