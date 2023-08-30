const deb = {} as Record<string, any>;

export const debounce = (id: string, fn: Function, delay: number) => {
  if (deb[id]) {
    clearTimeout(deb[id]);
    deb[id] = undefined;
  }
  deb[id] = setTimeout(() => fn(), delay);
};

export const getGroups = () => {
  return groups.map((group: any) => t(group.key));
};

export const getGroup = (i: number) => {
  return t(groups[i].key);
};

export const formatDate = (time: number) => {
  const timeoffset = new Date().getTimezoneOffset() * 60 * 1000;
  const date = new Date(time + timeoffset);
  return date.toLocaleString(t("lang_code"), { month: "long", day: "numeric", year: "numeric" });
};

export const animate = ref(true);

export const animateElements = () => {
  animate.value = false;
  setTimeout(() => {
    animate.value = true;
  });
};

export const yearsFromStories = (stories: MappedLoveStory[]) => {
  const years = stories.map((story) => story.year);
  return [...new Set(years)];
};

export const storiesByYear = (stories: MappedLoveStory[], year: number) => {
  return stories.filter((story) => story.year === year);
};

export const getStoryImageFromUser = (storyId: number, code?: string) => {
  const { user } = useUserSession();
  const bondCode = user.value?.bond?.code || code;
  return `${SITE.cdn}/uploads/${bondCode}-${storyId}`;
};

export const copyToClipboard = async (text: string) => {
  if (typeof navigator === "undefined" || !navigator.clipboard || !navigator.clipboard.writeText) {
    return { success: false, message: t("copy_not_supported") };
  }
  await navigator.clipboard.writeText(text);
  return { success: true, message: t("copy_success") };
};

export const storiesCarousel = (marker: MappedLoveMarker, stories: MappedLoveStory[], code?: string) => {
  return !stories.length ? `<div class="mt-2 text-center fw-bold">${marker.title}</div>` :
    `<div id="storyCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
      <div class="carousel-inner mw-100 mx-auto">`
        + stories.map(({ id, updatedAt }, index) => {
          return `
          <div class="carousel-item ${!index ? "active" : ""} d-flex justify-content-center">
            <div class="border border-primary border-2 rounded-circle">
              <div class="map-story" style="background-image: url('${getStoryImageFromUser(id, code)}?updated=${updatedAt}')"></div>
            </div>
          </div>`;
        }).join("")
        + `
        <div class="position-absolute end-0 top-0 rounded-pill bg-primary text-white px-2 py-1 small fw-bold z-1">${stories.length}</div>
      </div>
    </div>
  <div class="mt-2 text-center fw-bold">${marker.title}</div>`.replace(/\n/g, "");
};
