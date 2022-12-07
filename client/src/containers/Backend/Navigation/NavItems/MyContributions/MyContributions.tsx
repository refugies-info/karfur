import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const MyContributions = () => (
  <BackendNavItem
    route={"/backend/user-dash-contrib" as PathNames}
    iconName="file-add-outline"
    titlekey="Toolbar.Mes fiches"
    access="all"
  />
);

export default MyContributions;
