import { $fetch } from "@nuxt/test-utils-nightly/e2e";
import { describe, expect, test } from "vitest";

describe("markers", async () => {
  let markerId = 1;

  test.sequential("should create a marker", async () => {
    const marker = await $fetch<MappedLoveMarker>("/api/markers", {
      method: "POST",
      headers: { cookie: global.cookie },
      body: {
        lat: 1,
        lng: 1,
        group: 1,
        title: "New Marker",
        description: "Test marker description"
      }
    });

    markerId = marker.id;

    expect(marker).toBeDefined();
    expect(marker.id).toBeDefined();
    expect(marker.title).toBe("New Marker");
    expect(marker.description).toBe("Test marker description");
    expect(marker.lat).toBe(1);
    expect(marker.lng).toBe(1);
    expect(marker.group).toBe(1);
    expect(marker.bond).toBe(1);
  });

  test.sequential("should delete a marker", async () => {
    await $fetch<MappedLoveMarker>(`/api/markers/${markerId}`, {
      method: "DELETE",
      headers: { cookie: global.cookie },
      onResponse: ({ response }) => {
        expect(response.status).toBe(204);
      }
    });

    const map = await $fetch<MappedLoveMap>("/api/bond/map", {
      headers: { cookie: global.cookie }
    });

    expect(map.markers.length).toBe(0);
  });
});
