import { $fetch } from "@nuxt/test-utils-nightly/e2e";
import { afterAll, describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { setupTestServer } from "./__setup__";

setupTestServer();

describe("stories", async () => {
  let createdMarker: MappedLoveMarker;
  let createdStory: MappedLoveStory;

  test.sequential("should create a story from a marker", async () => {
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

    const formData = new FormData();
    const avatarBuffer = await readFile(join(process.cwd(), "public/images/defaults/avatar-5.jpg"));
    const avatarFile = new File([new Uint8Array(avatarBuffer)], "avatar-5.jpg", { type: "image/jpeg" });
    formData.append("file", avatarFile);
    formData.append("marker", createdMarker.id.toString());
    formData.append("description", "Test Story");
    formData.append("year", "2025");
    formData.append("month", "8");

    const story = await $fetch<MappedLoveStory>("/api/stories", {
      method: "POST",
      headers: { cookie: global.cookie },
      body: formData
    });

    createdStory = story;

    expect(story).toMatchObject<MappedLoveStory>({
      id: expect.any(Number),
      marker: createdMarker.id,
      bond: 1,
      user: 2,
      description: "Test Story",
      year: 2025,
      month: 8,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
      hash: expect.any(String)
    });
  });

  test.sequential("should update a story", async () => {
    const formData = new FormData();
    const avatarBuffer = await readFile(join(process.cwd(), "public/images/defaults/avatar-4.jpg"));
    const avatarFile = new File([new Uint8Array(avatarBuffer)], "avatar-4.jpg", { type: "image/jpeg" });
    formData.append("file", avatarFile);
    formData.append("marker", createdMarker.id.toString());
    formData.append("description", "Updated Test Story");
    formData.append("year", "2024");
    formData.append("month", "1");

    const story = await $fetch<MappedLoveStory>(`/api/stories/${createdStory.id}`, {
      method: "PATCH",
      headers: { cookie: global.cookie },
      body: formData
    });

    expect(story).toMatchObject<MappedLoveStory>({
      id: createdStory.id,
      marker: createdMarker.id,
      bond: 1,
      user: 2,
      description: "Updated Test Story",
      year: 2024,
      month: 1,
      createdAt: createdStory.createdAt,
      updatedAt: expect.any(Number),
      hash: createdStory.hash
    });
  });

  test.sequential("should exist story image upload", async () => {
    const response = await $fetch<Blob>(`/uploads/stories/${createdStory.hash}`, {
      headers: { cookie: global.cookie }
    });

    expect(response).toMatchObject<Partial<Blob>>({
      size: expect.toSatisfy((size: number) => size > 0),
      type: "image/jpeg"
    });
  });

  test.sequential("should delete a story", async () => {
    await $fetch<MappedLoveStory>(`/api/stories/${createdStory.id}`, {
      method: "DELETE",
      headers: { cookie: global.cookie },
      onResponse: ({ response }) => {
        expect(response.status).toBe(204);
      }
    });

    const map = await $fetch<MappedLoveMap>("/api/bond/map", {
      headers: { cookie: global.cookie }
    });

    const foundStory = map.stories.find(s => s.id === createdStory.id);
    expect(foundStory).toBeUndefined();
  });

  afterAll(async () => {
    await $fetch<MappedLoveMarker>(`/api/markers/${createdMarker.id}`, {
      method: "DELETE",
      headers: { cookie: global.cookie }
    });
  });
});
