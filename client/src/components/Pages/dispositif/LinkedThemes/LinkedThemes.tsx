import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { getPath } from "routes";
import { getLinkedThemesReadableText } from "lib/getReadableText";
import { secondaryThemesSelector, themeSelector, themesSelector } from "services/Themes/themes.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import ThemeIcon from "components/UI/ThemeIcon";
import SectionButtons from "../SectionButtons";
import styles from "./LinkedThemes.module.scss";

interface ButtonProps {
  children?: string;
  image: React.ReactNode;
  color: string;
  pathParams?: string;
}
const Button = (props: ButtonProps) => (
  <Link href={getPath("/recherche", "fr", props.pathParams)} className={styles.btn} style={{ color: props.color }}>
    {props.children}
    <span className="ms-2">{props.image}</span>
  </Link>
);

const LinkedThemes = () => {
  const themes = useSelector(themesSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  return (
    <div className={styles.container}>
      <p className={styles.title}>Thématiques liées</p>
      <div className={styles.row}>
        {theme && (
          <Button
            image={<ThemeIcon theme={theme} color={theme.colors.color100} size={16} />}
            color={theme.colors.color100}
            pathParams={`?themes=${theme._id}`}
          >
            {theme.short?.fr}
          </Button>
        )}
        {secondaryThemes.map((theme, i) => (
          <Button
            key={i}
            image={<ThemeIcon theme={theme} color={theme.colors.color100} size={16} />}
            color={theme.colors.color100}
            pathParams={`?themes=${theme._id}`}
          >
            {theme.short?.fr}
          </Button>
        ))}
        {needs.map((need, i) => (
          <Button
            key={i}
            image={<Image src={need.image?.secure_url || ""} width={16} height={16} alt="" />}
            color={themes.find((t) => t._id === need.theme._id)?.colors.color100 || "black"}
            pathParams={`?needs=${need._id}`}
          >
            {need.fr.text}
          </Button>
        ))}
      </div>
      <SectionButtons id="themes" content={getLinkedThemesReadableText(theme, secondaryThemes, needs)} />
    </div>
  );
};

export default LinkedThemes;
