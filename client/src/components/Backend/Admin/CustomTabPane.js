import React from 'react';
import {TabPane} from 'reactstrap';

import UsersTab from './UsersTab/UsersTab';
import LanguesTab from './LanguesTab/LanguesTab';
import ThemesTab from './ThemesTab/ThemesTab';
import StructuresTab from './StructuresTab/StructuresTab';
import AdminContenu from '../../../containers/Backend/AdminContenu/AdminContenu';
import Dashboard from '../../../containers/Backend/Dashboard/Dashboard';

const customTabPane = (props) => {
  return(
    <>
      <TabPane tabId="0" className="no-padding">
        <AdminContenu/>
      </TabPane>
      <TabPane tabId="1">
        <UsersTab {...props}/>
      </TabPane>
      <TabPane tabId="2">
        <LanguesTab {...props} />
      </TabPane>
      <TabPane tabId="3">
        <ThemesTab {...props} />
      </TabPane>
      <TabPane tabId="4">
        <StructuresTab {...props} />
      </TabPane>
      <TabPane tabId="5" className="no-padding">
        <Dashboard />
      </TabPane>
    </>
  )
}

export default customTabPane;