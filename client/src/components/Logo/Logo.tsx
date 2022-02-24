import React from "react";
import Link from "next/link";
import Image from "next/image";

import { logoRI, logo_mobile } from "assets/figma";
import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <Link href="/">
      <a className={`${styles.logo} mr-10`}>
        <div
          className={styles.logo_img}
        >
          <Image
            key="logo"
            src={logoRI}
            alt="logo refugies-info"
          />
        </div>
        <div
          className={styles.logo_img_mobile}
        >
          <Image
            key="logo_mobile"
            src={logo_mobile}
            alt="logo refugies-info"
            width={50}
            height={50}
          />
        </div>
      </a>
    </Link>
  );
};

export default Logo;
