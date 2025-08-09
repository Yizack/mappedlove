import { fetch } from "@nuxt/test-utils/e2e";

export const getSessionCookie = async () => {
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

  const setCookie = loginResponse.headers.getSetCookie();

  const sessionCookie = setCookie.find(cookie => cookie.startsWith("nuxt-session="));
  if (!sessionCookie) throw new Error("Session cookie not found");
  return sessionCookie;
};
