import en from "~/locales/en.js";

const locales = { en };

class Locale {
  constructor (code) {
    this.code = String(code).toLowerCase();
  }

  get (key = "") {
    return locales[this.code][key] || locales.en[key] || key;
  }

  setLanguage (code = "en") {
    this.code = String(code).toLowerCase();
  }
}

export const locale = new Locale("en");

export const t = (key) => {
  return locale.get(key);
};
