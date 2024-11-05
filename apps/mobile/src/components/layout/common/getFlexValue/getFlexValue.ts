const getFlexValue = (layout: string, index: number) => {
  const flexValues = layout.split(" ");
  const flexIndex = index % flexValues.length;
  return flexValues[flexIndex];
};

export default getFlexValue;
