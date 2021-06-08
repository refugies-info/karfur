import React from "react";
import { isMobile } from "react-device-detect";
import { NavLink } from "react-router-dom";

import { logoRI, logo_mobile } from "../../assets/figma";

import "./Logo.scss";

const logo = (props) => {
  if (props.isRTL && !isMobile) {
    return (
      <NavLink to="/" className="logo mr-10">
        <img src={logoRI} className="logo-img-rtl" alt="logo refugies-info" />
      </NavLink>
    );
  }
  if (isMobile) {
    return (
      <NavLink to="/" className="logo mr-10">
        <img
          src={logo_mobile}
          className="logo_webmobile"
          alt="logo refugies-info-mobile"
        />
      </NavLink>
    );
  }

  return (
    <NavLink to="/" className="logo mr-10">
      <img src={logoRI} className="logo-img" alt="logo refugies-info" />
    </NavLink>
  );
};

export default logo;
