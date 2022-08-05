import React from "react";
import { TabPane } from "reactstrap";
import { AdminContenu } from "containers/Backend/Admin/AdminContenu/AdminContenu";
import { AdminStructures } from "containers/Backend/Admin/AdminStructures/AdminStructures";
import { AdminUsers } from "containers/Backend/Admin/AdminUsers/AdminUsers";
import { Needs } from "containers/Backend/Admin/Needs/Needs";
import { Widgets } from "containers/Backend/Admin/Widgets/Widgets";
import Dashboard from "containers/Backend/Dashboard/Dashboard";
import { TabQuery } from "lib/getAdminUrlParams";

interface Props {
  activeTab: TabQuery
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
      <TabPane tabId="besoins" className="p-0">
        <Needs />
      </TabPane>
      <TabPane tabId="widgets" className="p-0">
        <Widgets />
      </TabPane>
    </>
  );
};

export default CustomTabPane;
