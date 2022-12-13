import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const MyStructure = () => (
  <BackendNavItem
    route={"/backend/user-dash-structure" as PathNames}
    iconName="briefcase-outline"
    titlekey="Toolbar.Ma structure"
    access="hasStructure"
  />
);

export default MyStructure;
