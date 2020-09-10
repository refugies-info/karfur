import React from "react";
import { NavLink } from "react-router-dom";

import { logoRI, beta } from "../../assets/figma";

import "./Logo.scss";

const logo = (props) => {
  if (props.isRTL) {
    return (
      <NavLink to="/" className="logo mr-10">
        <img src={beta} />
        <img src={logoRI} className="logo-img-rtl" alt="logo refugies-info" />
      </NavLink>
    );
  }
  return (
    <NavLink to="/" className="logo mr-10">
      <img src={logoRI} className="logo-img" alt="logo refugies-info" />
      <img src={beta} />
    </NavLink>
  );
};

export default logo;
