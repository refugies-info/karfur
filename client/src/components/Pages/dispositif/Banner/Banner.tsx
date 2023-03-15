import React from "react";
import { useSelector } from "react-redux";
import { Id } from "api-types";
import { themeSelector } from "services/Themes/themes.selectors";
import styles from "./Banner.module.scss";

interface Props {
  themeId: Id | undefined;
}

const Banner = (props: Props) => {
  const theme = useSelector(themeSelector(props.themeId));
  return (
    <div
      className={styles.banner}
      style={theme?.banner.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}}
    ></div>
  );
};

export default Banner;
