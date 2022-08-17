import { styles } from "../theme"
import { tags } from "../data/tagData";
import { ThemeTag } from "../types/interface";

export const defaultColors: ThemeTag = {
  tagDarkColor: styles.colors.black,
  tagVeryLightColor: styles.colors.white,
  tagName: "",
  tagLightColor: styles.colors.white,
  iconName: ""
};

export const getThemeTag = (tagName: string) => {
  const currentTag = tags.find(t => tagName === t.name);
  if (!currentTag) return defaultColors;

  return {
    tagDarkColor: currentTag.darkColor,
    tagVeryLightColor: currentTag.veryLightColor,
    tagName: currentTag.name,
    tagLightColor: currentTag.lightColor,
    iconName: currentTag.icon
  }
}
