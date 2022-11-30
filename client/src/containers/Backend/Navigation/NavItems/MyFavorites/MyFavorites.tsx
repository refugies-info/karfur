import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const MyFavorites = () => (
  <BackendNavItem
    route={"/backend/user-favorites" as PathNames}
    iconName="star-outline"
    titlekey="Toolbar.Mes favoris"
    access="all"
  />
);

export default MyFavorites;
