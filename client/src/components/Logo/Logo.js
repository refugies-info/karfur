import React from "react";
import { NavLink } from "react-router-dom";

import { logo_header } from "../../assets/figma";

import "./Logo.scss";

const logo = () => (
  <NavLink to="/" className="logo mr-10">
    <img src={logo_header} className="logo-img" alt="logo refugies-info" />
  </NavLink>
);

export default logo;
