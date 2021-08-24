import { filtres } from "../../../Dispositif/data";

export const getTagColor = (tagName: string) => {
  const data = filtres.tags.filter((tag) => tag.name === tagName.toLowerCase());

  if (data && data.length > 0) {
    return data[0].darkColor;
  }
  return "#212121";
};
