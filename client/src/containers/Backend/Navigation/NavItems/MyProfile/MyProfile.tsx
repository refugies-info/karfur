import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const MyProfile = () => (
  <BackendNavItem
    route={"/backend/user-profile" as PathNames}
    iconName="person-outline"
    titlekey="Toolbar.Mon profil"
    access="all"
  />
);

export default MyProfile;
