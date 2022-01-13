import React from "react";
import { isMobile } from "react-device-detect";
import Link from "next/link";
// import { NavLink } from "react-router-dom";

import { logoRI, logo_mobile } from "../../assets/figma";

import "./Logo.module.scss";

const logo = (props) => {
  if (props.isRTL && !isMobile) {
    return (
      <Link href="/" className="logo mr-10">
        <img src={logoRI} className="logo-img-rtl" alt="logo refugies-info" />
      </Link>
    );
  }
  if (isMobile) {
    return (
      <Link href="/" className="logo mr-10">
        <img
          src={logo_mobile}
          className="logo_webmobile"
          alt="logo refugies-info-mobile"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="logo mr-10">
      <img src={logoRI} className="logo-img" alt="logo refugies-info" />
    </Link>
  );
};

export default logo;
