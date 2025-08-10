import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("account", async () => {
  test("downloads user account data", async () => {
    const account = await $fetch<MappedLoveAccountData>("/api/account", {
      headers: { cookie: global.cookie },
      query: {
        id: 2
      }
    });
    expect(account).toBeDefined();
    expect(account.user).toBeDefined();
    expect(account.user.email).toBe("test2@test.test");
  });
});
