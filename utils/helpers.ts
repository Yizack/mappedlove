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
  