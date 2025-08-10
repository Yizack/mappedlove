import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

describe("account", async () => {
  test("should upload user avatar image", async () => {
    const formData = new FormData();
    const avatarBuffer = await readFile(join(process.cwd(), "public/images/defaults/avatar-5.jpg"));
    const avatarFile = new File([new Uint8Array(avatarBuffer)], "avatar-5.jpg", { type: "image/jpeg" });
    formData.append("file", avatarFile);

    const account = await $fetch<MappedLoveUser>("/api/account/avatar", {
      method: "POST",
      headers: { cookie: global.cookie },
      body: formData
    });

    expect(account).toBeDefined();
    expect(account.showAvatar).toBe(true);
  });

  test("should delete user avatar image", async () => {
    await $fetch<MappedLoveUser>("/api/account/avatar", {
      method: "DELETE",
      headers: { cookie: global.cookie }
    });

    const accountData = await $fetch<MappedLoveAccountData>("/api/account", {
      headers: { cookie: global.cookie },
      query: { id: 2 }
    });

    expect(accountData).toBeDefined();
    expect(accountData.user).toBeDefined();
    expect(accountData.user.showAvatar).toBe(false);
  });

  test("should download user account data", async () => {
    const accountData = await $fetch<MappedLoveAccountData>("/api/account", {
      headers: { cookie: global.cookie },
      query: {
        id: 2
      }
    });

    expect(accountData).toBeDefined();
    expect(accountData.user).toBeDefined();
    expect(accountData.user.email).toBe("test2@test.test");
  });

  test("should patch account data", async () => {
    const date = Date.now();
    const account = await $fetch<MappedLoveUser>("/api/account", {
      method: "PATCH",
      headers: { cookie: global.cookie },
      body: {
        name: "Test User",
        country: "PA",
        birthDate: date,
        language: "en"
      }
    });

    expect(account).toBeDefined();
    expect(account.name).toBe("Test User");
    expect(account.country).toBe("PA");
    expect(account.birthDate).toBe(date);
    expect(account.language).toBe("en");
  });
});
