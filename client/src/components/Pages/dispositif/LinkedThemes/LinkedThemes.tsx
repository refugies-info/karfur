import { GetNeedResponse, GetThemeResponse } from "api-types";
import React from "react";
import styles from "./LinkedThemes.module.scss";

interface Props {
  theme: GetThemeResponse | null;
  secondaryThemes: GetThemeResponse[];
  needs: GetNeedResponse[];
}

const LinkedThemes = (props: Props) => {
  return (
    <div>
      <span>{props.theme && props.theme.short?.fr}</span>
      {props.secondaryThemes.map((theme, i) => (
        <span key={i}>{theme.short?.fr}</span>
      ))}
      {props.needs.map((need, i) => (
        <span key={i}>{need.fr.text}</span>
      ))}
    </div>
  );
};

export default LinkedThemes;
