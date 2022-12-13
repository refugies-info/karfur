import { PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const Admin = () => (
  <BackendNavItem
    route={"/backend/admin" as PathNames}
    iconName="shield-outline"
    titlekey="Toolbar.Administration"
    access="admin"
  />
);

export default Admin;
