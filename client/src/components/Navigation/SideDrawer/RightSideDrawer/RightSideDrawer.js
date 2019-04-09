import React from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';

import './RightSideDrawer.css'

const rightSideDrawer = (props) => {
  let attachedClasses = ["SideDrawer", "Close"];
  if (props.open) {
    attachedClasses = ["SideDrawer", "Open"];
  }
  return(
    <TabPane tabId="2" className="p-3">
      <div className="message">
        <div className="py-3 pb-5 mr-3 float-left">
          <div className="avatar">
            <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            <span className="avatar-status badge-success"></span>
          </div>
        </div>
        <div>
          <small className="text-muted">Lukasz Holeczek</small>
          <small className="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt...
        </small>
      </div>
      <hr />
      <div className="message">
        <div className="py-3 pb-5 mr-3 float-left">
          <div className="avatar">
            <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            <span className="avatar-status badge-success"></span>
          </div>
        </div>
        <div>
          <small className="text-muted">Lukasz Holeczek</small>
          <small className="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt...
        </small>
      </div>
      <hr />
      <div className="message">
        <div className="py-3 pb-5 mr-3 float-left">
          <div className="avatar">
            <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            <span className="avatar-status badge-success"></span>
          </div>
        </div>
        <div>
          <small className="text-muted">Lukasz Holeczek</small>
          <small className="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt...
        </small>
      </div>
      <hr />
      <div className="message">
        <div className="py-3 pb-5 mr-3 float-left">
          <div className="avatar">
            <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            <span className="avatar-status badge-success"></span>
          </div>
        </div>
        <div>
          <small className="text-muted">Lukasz Holeczek</small>
          <small className="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt...
        </small>
      </div>
      <hr />
      <div className="message">
        <div className="py-3 pb-5 mr-3 float-left">
          <div className="avatar">
            <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            <span className="avatar-status badge-success"></span>
          </div>
        </div>
        <div>
          <small className="text-muted">Lukasz Holeczek</small>
          <small className="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt...
        </small>
      </div>
    </TabPane>
  )
}

export default rightSideDrawer;