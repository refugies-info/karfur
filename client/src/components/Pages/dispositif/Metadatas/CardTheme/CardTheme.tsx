import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { GetDispositifResponse } from "api-types";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import TagName from "components/UI/TagName";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BaseCard from "../BaseCard";
import AdminIcon from "assets/dispositif/admin-icon.svg";
import styles from "./CardTheme.module.scss";

interface Props {
  dataTheme: GetDispositifResponse["theme"] | undefined;
  dataSecondaryThemes: GetDispositifResponse["secondaryThemes"] | undefined;
  color: string;
  onClick?: () => void;
}

const CardTheme = ({ dataTheme, dataSecondaryThemes, color, onClick }: Props) => {
  const theme = useSelector(themeSelector(dataTheme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dataSecondaryThemes));
  const content = useMemo(() => {
    return (
      <div>
        {theme && (
          <span className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName theme={theme} size={16} />
            <Image src={AdminIcon} width={20} height={20} alt="" className="ms-2" />
          </span>
        )}
        {secondaryThemes.map((theme, i) => (
          <span key={i} className={styles.badge} style={{ backgroundColor: theme.colors.color100 }}>
            <TagName theme={theme} size={16} />
          </span>
        ))}
      </div>
    );
  }, [theme, secondaryThemes]);
  return (
    <BaseCard
      title={
        <>
          <EVAIcon name="color-palette-outline" size={24} fill={theme?.colors.color100 || "#000"} className={"me-2"} />
          Thèmes
        </>
      }
      items={[{ content, icon: null }]}
      color={color}
      onClick={onClick}
    />
  );
};

export default CardTheme;
