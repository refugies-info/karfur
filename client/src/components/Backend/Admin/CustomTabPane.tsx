import React from "react";
import { TabPane } from "reactstrap";
import { AdminContenu } from "containers/Backend/Admin/AdminContenu/AdminContenu";
import { AdminStructures } from "containers/Backend/Admin/AdminStructures/AdminStructures";
import { AdminUsers } from "containers/Backend/Admin/AdminUsers/AdminUsers";
import { Needs } from "containers/Backend/Admin/Needs/Needs";
import Dashboard from "containers/Backend/Dashboard/Dashboard";

const CustomTabPane = () => {
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
      <TabPane tabId="statistiques" className="p-0">
        <Dashboard />
      </TabPane>
      <TabPane tabId="besoins" className="p-0">
        <Needs />
      </TabPane>
    </>
  );
};

export default CustomTabPane;
