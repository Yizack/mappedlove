import countriesData from "~/assets/countries.json";

class Countries {
  getAll () {
    return countriesData;
  }

  getEmoji (code: string | null) {
    return countriesData.find(country => country.code === code)?.emoji || "";
  }

  getName (code: string | null) {
    return countriesData.find(country => country.code === code)?.name || "";
  }
}

const countries = new Countries();

export default defineNuxtPlugin(() => {
  return {
    provide: { countries }
  };
});
