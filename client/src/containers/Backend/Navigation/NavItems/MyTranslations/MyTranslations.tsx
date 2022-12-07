import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const MyTranslations = () => (
  <BackendNavItem
    route={"/backend/user-translation" as PathNames}
    iconName="globe-outline"
    titlekey="Toolbar.Mes traductions"
    access="all"
  />
);

export default MyTranslations;
