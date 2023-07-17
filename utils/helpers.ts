const deb = {} as {[key: string]: any };

export const debounce = (id: string, fn: Function, delay: number) => {
  if (deb[id]) {
    clearTimeout(deb[id]);
    deb[id] = undefined;
  }
  deb[id] = setTimeout(() => fn(), delay);
};

export const getGroups = () => {
  const { payload } = useNuxtApp();
  return payload.data.groups.map((group: any) => ({ name: t(group.name)}));
};

export const getGroup = (id: number) => {
  const { payload } = useNuxtApp();
  return t(payload.data.groups[id].name);
};
