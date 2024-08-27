const ICON_EXPLORER = "compass";
const ICON_FAVORITES = "star";
const ICON_SEARCH = "search";
const ICON_PROFILE = "person";

export const getTabBarIcon = (routeName: string) => {
  switch (routeName) {
    case "Explorer":
      return ICON_EXPLORER;
    case "Favoris":
      return ICON_FAVORITES;
    case "Profil":
      return ICON_PROFILE;
    case "Search":
      return ICON_SEARCH;
    default:
      return "";
  }
};
