import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("session", async () => {
  test("should be successful login", async () => {
    expect(global.cookie).toBeDefined();
  });

  test("should fetch user session", async () => {
    const session = await $fetch<{ user: MappedLoveUser }>("/api/_auth/session", {
      headers: { cookie: global.cookie }
    });
    expect(session).toBeDefined();
    expect(session.user).toBeDefined();
    expect(session.user.email).toBe("test2@test.test");
  });
});
