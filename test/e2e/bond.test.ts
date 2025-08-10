import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("bond", async () => {
  test("should fetch bond data", async () => {
    const bond = await $fetch<MappedLoveBond>("/api/bond", {
      headers: { cookie: global.cookie }
    });

    expect(bond).toBeDefined();
    expect(bond.id).toBe(1);
    expect(bond.code).toBe("QDZV1");
    expect(bond.partner1).toBe(1);
    expect(bond.partner2).toBe(2);
    expect(bond.bonded).toBe(true);
    expect(bond.premium).toBe(false);
  });

  test("should patch bond data", async () => {
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

    expect(bond).toBeDefined();
    expect(bond.coupleDate).toBe(coupleDate);
    expect(bond.public).toBe(true);
  });

  test("should fetch bond dashboard map markers and stories", async () => {
    const map = await $fetch<MappedLoveMap>("/api/bond/map", {
      headers: { cookie: global.cookie }
    });

    expect(map).toBeDefined();
    expect(map.markers).toBeDefined();
    expect(map.stories).toBeDefined();
  });

  test("should fetch bond public map", async () => {
    const map = await $fetch<MappedLovePublicMap>("/api/bond/public/QDZV1", {
      headers: { cookie: global.cookie }
    });

    expect(map).toBeDefined();
    expect(map.id).toBe(1);
    expect(map.code).toBe("QDZV1");
    expect(map.public).toBe(true);
    expect(map.partners).toBeDefined();
    expect(map.markers).toBeDefined();
    expect(map.stories).toBeDefined();
  });
});
