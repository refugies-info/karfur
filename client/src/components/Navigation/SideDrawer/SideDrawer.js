import React from 'react';

import Backdrop from '../../UI/Backdrop/Backdrop';
import LeftSideDrawer from './LeftSideDrawer/LeftSideDrawer'
import RightSideDrawer from './RightSideDrawer/RightSideDrawer'

import './SideDrawer.scss';

const sideDrawer = ( props ) => {
  const drawer = (
    props.side ==='left' ? <LeftSideDrawer {...props}/> : <RightSideDrawer {...props}/>
  )
  return (
    <>
      <Backdrop show={props.open} clicked={props.closed}/>
      {drawer}
    </>
  );
};

export default sideDrawer;