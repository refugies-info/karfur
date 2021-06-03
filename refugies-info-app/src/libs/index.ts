export const firstLetterUpperCase = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const sortByOrder = (a: { order: number }, b: { order: number }) => {
  const orderA = a.order;
  const orderB = b.order;
  return orderA > orderB ? 1 : -1;
};
