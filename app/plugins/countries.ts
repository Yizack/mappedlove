import countriesData from "~/assets/countries.json";

class Countries {
  getAll () {
    return countriesData;
  }

  getEmoji (code: string | null) {
    return countriesData.find(country => country.code === code?.toUpperCase())?.emoji || "";
  }

  getName (code: string | null) {
    return countriesData.find(country => country.code === code?.toUpperCase())?.name || "";
  }
}

declare module "#app" {
  interface NuxtApp {
    $countries: Countries;
  }
}

export default defineNuxtPlugin({
  parallel: true,
  async setup () {
    const countries = new Countries();
    return {
      provide: { countries }
    };
  }
});
