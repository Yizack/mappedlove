import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { beforeAll, describe, expect, test } from "vitest";
import { getSessionCookie } from "../utils/login";

await setup({ dev: true });

let cookie: string;

beforeAll(async () => {
  await $fetch("/_nitro/tasks/seed");
  cookie = await getSessionCookie();
});

describe("session", async () => {
  test("successful login", async () => {
    expect(cookie).toBeDefined();
  });

  test("fetch user session", async () => {
    const session = await $fetch<{ user: MappedLoveUser }>("/api/_auth/session", { headers: { cookie } });
    expect(session).toBeDefined();
    expect(session.user).toBeDefined();
    expect(session.user.email).toBe("test2@test.test");
  });
});
