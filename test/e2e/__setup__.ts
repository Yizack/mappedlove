import { $fetch, fetch, setup } from "@nuxt/test-utils-nightly/e2e";
import { beforeAll } from "vitest";

const getSessionCookie = async (maxRetries = 5, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "test2@test.test",
          password: "test",
          remember: true
        })
      });

      if (!loginResponse.ok) {
        throw new Error(`Test login failed with status: ${loginResponse.status}`);
      }

      const setCookie = loginResponse.headers.getSetCookie();
      const sessionCookie = setCookie.find(cookie => cookie.startsWith("nuxt-session="));

      if (sessionCookie) {
        return sessionCookie;
      }

      throw new Error("Session cookie not found in response");
    }
    catch (e) {
      const error: Error = e as Error;
      console.info(`Attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(`Failed to get session cookie after ${maxRetries} attempts: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached without obtaining session cookie");
};

declare global {
  var cookie: string;
}

beforeAll(async () => {
  await setup({ host: "http://localhost:3000" });
  await $fetch("/_nitro/tasks/seed");
  global.cookie = await getSessionCookie();
});
