export const getDepartementFromResult = (
  data: { long_name: string; short_name: string; types: string[] }[]
) => {
  const result = data.filter((element) =>
    element.types.includes("administrative_area_level_2")
  );
  if (result.length > 0) {
    const department = result[0].long_name;
    if (department === "Département de Paris") {
      return "Paris";
    }
    return result[0].long_name;
  }
  return null;
};
