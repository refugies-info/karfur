import { GetNeedResponse, GetThemeResponse } from "api-types";
import { theme } from "components/UI/FButton/FButton.module.scss";
import ThemeIcon from "components/UI/ThemeIcon";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { themesSelector } from "services/Themes/themes.selectors";
import styles from "./LinkedThemes.module.scss";

interface ButtonProps {
  children?: string;
  image: React.ReactNode;
  color: string;
  pathParams?: any;
}
const Button = (props: ButtonProps) => (
  <Link href={getPath("/recherche", "fr")} className={styles.btn} style={{ color: props.color }}>
    {props.children}
    <span className="ms-2">{props.image}</span>
  </Link>
);

interface Props {
  theme: GetThemeResponse | null;
  secondaryThemes: GetThemeResponse[];
  needs: GetNeedResponse[];
}
const LinkedThemes = (props: Props) => {
  const themes = useSelector(themesSelector);
  return (
    <div>
      <p className={styles.title}>Thématiques liées</p>
      <div className={styles.row}>
        {props.theme && (
          <Button
            image={<ThemeIcon theme={props.theme} color={props.theme.colors.color100} size={16} />}
            color={props.theme.colors.color100}
          >
            {props.theme.short?.fr}
          </Button>
        )}
        {props.secondaryThemes.map((theme, i) => (
          <Button
            key={i}
            image={<ThemeIcon theme={theme} color={theme.colors.color100} size={16} />}
            color={theme.colors.color100}
          >
            {theme.short?.fr}
          </Button>
        ))}
        {props.needs.map((need, i) => (
          <Button
            key={i}
            image={<Image src={need.image?.secure_url || ""} width={16} height={16} alt="" />}
            color={themes.find((t) => t._id === need.theme._id)?.colors.color100 || "black"}
          >
            {need.fr.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LinkedThemes;
