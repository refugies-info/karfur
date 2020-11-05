import React from "react";
import { TabPane } from "reactstrap";

import UsersTab from "./UsersTab/UsersTab";
import StructuresTab from "./StructuresTab/StructuresTab";
import AdminContenu from "../../../containers/Backend/AdminContenu/AdminContenu";
import Dashboard from "../../../containers/Backend/Dashboard/Dashboard";

const customTabPane = (props) => {
  return (
    <>
      <TabPane tabId="0" className="no-padding">
        <AdminContenu onSelect={props.onSelect} />
      </TabPane>
      <TabPane tabId="1">
        <StructuresTab {...props} />
      </TabPane>
      <TabPane tabId="2">
        <UsersTab {...props} />
      </TabPane>
      <TabPane tabId="4" className="no-padding">
        <Dashboard />
      </TabPane>
    </>
  );
};

export default customTabPane;
