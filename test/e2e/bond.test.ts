import { $fetch } from "@nuxt/test-utils-nightly/e2e";
import { describe, expect, test } from "vitest";

describe("bond", async () => {
  test("should fetch bond data", async () => {
    const bond = await $fetch<MappedLoveBond>("/api/bond", {
      headers: { cookie: global.cookie }
    });

    expect(bond).toMatchObject<Partial<MappedLoveBond>>({
      id: 1,
      code: "QDZV1",
      partner1: 1,
      partner2: 2,
      bonded: true,
      premium: false,
      public: expect.any(Boolean),
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number)
    });
  });

  test.sequential("should patch bond data", async () => {
    const coupleDate = Date.now();
    await $fetch<MappedLoveBond>("/api/bond", {
      method: "PATCH",
      headers: { cookie: global.cookie },
      body: {
        coupleDate,
        public: true
      }
    });

    const bond = await $fetch<MappedLoveBond>("/api/bond", {
      headers: { cookie: global.cookie }
    });

    expect(bond).toMatchObject<Partial<MappedLoveBond>>({
      coupleDate,
      public: true
    });
  });

  test.sequential("should fetch bond public map", async () => {
    const map = await $fetch<MappedLovePublicMap>("/api/bond/public/QDZV1", {
      headers: { cookie: global.cookie }
    });

    expect(map).toMatchObject<MappedLovePublicMap>({
      id: 1,
      code: "QDZV1",
      public: true,
      bonded: true,
      premium: expect.any(Boolean),
      coupleDate: expect.any(Number),
      partners: expect.any(Array),
      markers: expect.any(Array),
      stories: expect.any(Array),
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number)
    });
  });

  test("should fetch bond dashboard map markers and stories", async () => {
    const map = await $fetch<MappedLoveMap>("/api/bond/map", {
      headers: { cookie: global.cookie }
    });

    expect(map).toMatchObject<MappedLoveMap>({
      markers: expect.any(Array),
      stories: expect.any(Array)
    });
  });
});
