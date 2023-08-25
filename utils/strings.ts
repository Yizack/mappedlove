import en from "~/locales/en";

const locales: Record<string, Record<string, string>> = { en };

class Locale {
  code: string;
  constructor (code: string) {
    this.code = String(code).toLowerCase();
  }

  get (key: string) {
    return locales[this.code][key] || locales.en[key] || key;
  }

  setLanguage (code = "en") {
    this.code = String(code).toLowerCase();
  }
}

export const locale = new Locale("en");

export const t = (key: string) => {
  return locale.get(key);
};
