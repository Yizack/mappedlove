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

export default defineNuxtPlugin(() => {
  const countries = new Countries();
  return {
    provide: { countries }
  };
});
