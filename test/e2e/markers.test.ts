import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("markers", async () => {
  test("should create a marker", async () => {
    const marker = await $fetch<MappedLoveMarker>("/api/markers", {
      method: "POST",
      headers: { cookie: global.cookie },
      body: {
        lat: 1,
        lng: 1,
        group: 1,
        title: "New Marker",
        description: "Marker description"
      }
    });

    expect(marker).toBeDefined();
    expect(marker.id).toBeDefined();
    expect(marker.title).toBe("New Marker");
    expect(marker.description).toBe("Test Marker Description");
    expect(marker.lat).toBe(1);
    expect(marker.lng).toBe(1);
    expect(marker.group).toBe(1);
    expect(marker.bond).toBe(1);
  });
});
