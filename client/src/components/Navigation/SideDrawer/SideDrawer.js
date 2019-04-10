import React from 'react';

import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';
import LeftSideDrawer from './LeftSideDrawer/LeftSideDrawer'
import RightSideDrawer from './RightSideDrawer/RightSideDrawer'

import './SideDrawer.css';

const sideDrawer = ( props ) => {
  const drawer = (
    props.side ==='left' ? <LeftSideDrawer {...props}/> : <RightSideDrawer {...props}/>
  )
  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed}/>
      {drawer}
    </Aux>
  );
};

export default sideDrawer;