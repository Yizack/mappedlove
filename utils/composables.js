export const setScrollBehavior = (behavior = "smooth") => {
  const { options } = useRouter();
  options.scrollBehavior = (to) => {
    if (to.hash === "") {
      return { left: 0, top: 0 };
    }
    else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, top: 55, left: 0, behavior });
        }, 500);
      });
    }
  };
};
