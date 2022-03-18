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
      <TabPane tabId="0" className="p-0">
        <AdminContenu />
      </TabPane>
      <TabPane tabId="1" className="p-0">
        <AdminStructures />
      </TabPane>
      <TabPane tabId="2" className="p-0">
        <AdminUsers />
      </TabPane>
      <TabPane tabId="3" className="p-0">
        <Dashboard />
      </TabPane>
      <TabPane tabId="4" className="p-0">
        <Needs />
      </TabPane>
    </>
  );
};

export default CustomTabPane;
