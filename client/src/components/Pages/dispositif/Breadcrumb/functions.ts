export const getDepartments = (location: string[] | undefined) => {
  if (!location) return "";
  const nbDepartments = location?.filter((d) => d !== "All").length || 0;
  if (nbDepartments === 0) return "";
  if (nbDepartments === 1) return `(${location[0]})`;
  return `dans ${nbDepartments} départements`;
}
