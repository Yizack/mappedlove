import en from "~/locales/en";

const locales: Record<string, Record<string, string>> = { en };

class Locale {
  code: string;
  constructor (code: string) {
    this.code = String(code).toLowerCase();
  }

  get (key: string, values?: Record<string, string>) {
    const text = locales[this.code][key] || locales.en[key] || key;
    if (!values) return text;
    return Object.keys(values).reduce((acc, key) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "gi"), values[key]), text);
  }

  setLanguage (code = "en") {
    this.code = String(code).toLowerCase();
  }
}

export const locale = new Locale("en");

export const t = (key: string, values?: Record<string, any>) => {
  return locale.get(key, values);
};
