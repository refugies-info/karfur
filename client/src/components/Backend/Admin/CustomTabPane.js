import React from "react";
import { TabPane } from "reactstrap";
import { AdminContenu } from "../../../containers/Backend/Admin/AdminContenu/AdminContenu";
import { AdminStructures } from "../../../containers/Backend/Admin/AdminStructures/AdminStructures";
import { AdminUsers } from "../../../containers/Backend/Admin/AdminUsers/AdminUsers";
import { Needs } from "../../../containers/Backend/Admin/Needs/Needs";

import Dashboard from "../../../containers/Backend/Dashboard/Dashboard";

const customTabPane = () => {
  return (
    <>
      <TabPane tabId="0" className="no-padding">
        <AdminContenu />
      </TabPane>
      <TabPane tabId="1" className="no-padding">
        <AdminStructures />
      </TabPane>
      <TabPane tabId="2" className="no-padding">
        <AdminUsers />
      </TabPane>
      <TabPane tabId="3" className="no-padding">
        <Dashboard />
      </TabPane>
      <TabPane tabId="4" className="no-padding">
        <Needs />
      </TabPane>
    </>
  );
};

export default customTabPane;
