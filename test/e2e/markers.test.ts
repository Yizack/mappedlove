import { $fetch } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("markers", async () => {
  let createdMarker: MappedLoveMarker;

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

    createdMarker = marker;

    expect(marker).toMatchObject<MappedLoveMarker>({
      id: expect.any(Number),
      title: "New Marker",
      description: "Test marker description",
      lat: 1,
      lng: 1,
      group: 1,
      bond: 1,
      order: expect.any(Number)
    });
  });

  test.sequential("should update a marker", async () => {
    const marker = await $fetch<MappedLoveMarker>(`/api/markers/${createdMarker.id}`, {
      method: "PUT",
      headers: { cookie: global.cookie },
      body: {
        lat: 1,
        lng: 1,
        group: 1,
        title: "New Marker",
        description: "Test marker description",
        order: createdMarker.order
      }
    });

    expect(marker).toMatchObject<MappedLoveMarker>({
      id: createdMarker.id,
      lat: 1,
      lng: 1,
      group: 1,
      title: "New Marker",
      description: "Test marker description",
      order: createdMarker.order
    });
  });

  test.sequential("should delete a marker", async () => {
    await $fetch<MappedLoveMarker>(`/api/markers/${createdMarker.id}`, {
      method: "DELETE",
      headers: { cookie: global.cookie },
      onResponse: ({ response }) => {
        expect(response.status).toBe(204);
      }
    });

    const map = await $fetch<MappedLoveMap>("/api/bond/map", {
      headers: { cookie: global.cookie }
    });

    const findMarker = map.markers.find(m => m.id === createdMarker.id);
    expect(findMarker).toBeUndefined();
  });
});
