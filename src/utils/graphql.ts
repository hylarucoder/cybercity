export const calcDepth = (path) => {
  if (path) {
    return calcDepth(path.prev) + 1;
  }
  return 1;
};
