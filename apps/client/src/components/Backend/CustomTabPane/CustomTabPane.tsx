import { TabPane } from "reactstrap";
import type { TabQuery } from "~/lib/getAdminUrlParams";
import { AdminContenu } from "../screens/Admin/AdminContenu";
import { AdminStructures } from "../screens/Admin/AdminStructures";
import { AdminUsers } from "../screens/Admin/AdminUsers";
import { Needs } from "../screens/Admin/Needs";
import Dashboard from "../screens/Dashboard";

interface Props {
  activeTab: TabQuery;
}

const CustomTabPane = (props: Props) => {
  return (
    <>
      <TabPane tabId="contenus" className="p-0">
        <AdminContenu />
      </TabPane>
      <TabPane tabId="structures" className="p-0">
        <AdminStructures />
      </TabPane>
      <TabPane tabId="utilisateurs" className="p-0">
        <AdminUsers />
      </TabPane>
      <TabPane tabId="divers" className="p-0">
        <Dashboard visible={props.activeTab === "divers"} />
      </TabPane>
      <TabPane tabId="categories" className="p-0">
        <Needs />
      </TabPane>
    </>
  );
};

export default CustomTabPane;
