import React from 'react';
import {withRouter} from 'react-router-dom';

import Logo from '../../../Logo/Logo';
import NavigationItems from '../../NavigationItems/NavigationItems';
import BackendNavigationItems from '../../BackendNavigationItems/BackendNavigationItems';

import './LeftSideDrawer.css'

const leftSideDrawer = (props) => {
  let attachedClasses = ["SideDrawer", "Close", "HideSideDrawer"];
  if (props.open) {
      attachedClasses = ["SideDrawer", "Open", "HideSideDrawer"];
  }
  const path = props.location.pathname;
  if(path.includes("/backend")){
    attachedClasses.splice(2);
  }

  return(
    <div className={attachedClasses.join(' ')}>
      <Logo />
      <nav>
          {!path.includes("/backend") && <NavigationItems {...props} />}
          {path.includes("/backend") && <BackendNavigationItems {...props} />}
      </nav>
    </div>
  )
}

export default withRouter(leftSideDrawer);