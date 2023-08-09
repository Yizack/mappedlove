const deb = {} as {[key: string]: any };

export const debounce = (id: string, fn: Function, delay: number) => {
  if (deb[id]) {
    clearTimeout(deb[id]);
    deb[id] = undefined;
  }
  deb[id] = setTimeout(() => fn(), delay);
};

export const getGroups = () => {
  return groups.map((group: any) => ({ key: t(group.key)}));
};

export const getGroup = (i: number) => {
  return t(groups[i].key);
};

export const formatDate = (time: number) => {
  const timeoffset = new Date().getTimezoneOffset() * 60 * 1000;
  const date = new Date(time + timeoffset);
  return date.toLocaleString("en", { month: "short", day: "numeric", year: "numeric" });
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

export const getStoryImageFromUser = (storyId: number) => {
  const { user } = useUserSession();
  return `${SITE.cdn}/uploads/${user.value?.bond?.code}-${storyId}`;
};
