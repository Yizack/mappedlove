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
    expect(session.user).toMatchObject<Partial<MappedLoveUser>>({
      id: expect.any(Number),
      email: "test2@test.test",
      name: expect.any(String),
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number)
    });
  });
});
