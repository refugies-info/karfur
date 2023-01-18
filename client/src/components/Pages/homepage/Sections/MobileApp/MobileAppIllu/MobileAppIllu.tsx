import React from "react";
import Image from "next/image";
import { AutoplayVideo } from "components/Pages/staticPages/common";
import HomeAppMockup from "assets/homepage/app-mockup.png";
import styles from "./MobileAppIllu.module.scss";

const MobileAppIllu = () => {
  return (
    <div className={styles.container}>
      <div className={styles.front}>
        <AutoplayVideo src="/video/home-app-video.mp4" height={442} radius={26} />
      </div>
      <Image src={HomeAppMockup} height={510} alt="Mobile app mockup" className={styles.back} />
    </div>
  );
};

export default MobileAppIllu;
