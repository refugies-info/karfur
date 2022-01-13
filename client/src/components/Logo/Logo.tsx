import React from "react";
import Link from "next/link";
import Image from "next/image";
import { isMobile } from "react-device-detect";

import { logoRI, logo_mobile } from "../../assets/figma";
import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <Link href="/">
      <a className={`${styles.logo} mr-10`}>
        {!isMobile ?
          <Image
            src={logoRI}
            className={styles.logo_img}
            alt="logo refugies-info"
          /> :
          <Image
            src={logo_mobile}
            className={styles.logo_webmobile}
            alt="logo refugies-info"
          />
        }
      </a>
    </Link>
  );
};

export default Logo;
