import React, { useMemo } from "react";
import Image from "next/image";
import styled from "styled-components";
import { GetThemeResponse } from "api-types";
import { cls } from "lib/classname";
import ThemeIcon from "components/UI/ThemeIcon";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Tooltip from "components/UI/Tooltip";
import AdminIcon from "assets/dispositif/crown.svg";
import styles from "./ThemeSelectButton.module.scss";

interface ButtonProps {
  backgroundColor: string;
  backgroundColorHover: string;
  selected: boolean;
}
const ThemeButtonContainer = styled.button<ButtonProps>`
  ${(props) =>
    props.selected
      ? `
  background-color: ${props.backgroundColor};
  &:not(:disabled):hover {
    background-color: ${props.backgroundColorHover} !important;
  }`
      : `&:not(:disabled):hover {
        background-color: ${props.backgroundColor} !important;
      }`};
`;

interface Props {
  theme: GetThemeResponse;
  selectedPrimary: boolean;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ThemeSelectButton = (props: Props) => {
  const selected = useMemo(() => props.selectedPrimary || props.selected, [props.selectedPrimary, props.selected]);
  const id = useMemo(() => `theme_${props.theme._id.toString()}`, [props.theme]);
  return (
    <span id={id}>
      <ThemeButtonContainer
        backgroundColor={props.theme.colors.color100}
        backgroundColorHover={props.theme.colors.color80}
        selected={selected}
        className={cls(styles.btn, selected && styles.selected)}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        <span className={styles.theme_icon}>
          <ThemeIcon
            theme={props.theme}
            size={16}
            color={selected ? "white" : styles.darkBackgroundElevationContrast}
          />
        </span>
        <span className={styles.name}>{props.theme.short.fr}</span>
        {props.selectedPrimary && (
          <span
            className={styles.badge}
            style={{ backgroundColor: props.theme.colors.color30, color: props.theme.colors.color100 }}
          >
            thème principal
            <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />
          </span>
        )}
        {selected && <EVAIcon name="close-outline" size={24} className="ms-2" fill="white" />}
      </ThemeButtonContainer>
      {props.disabled && (
        <Tooltip target={id} placement="top">
          Vous pouvez sélectionner jusqu'à 3 thèmes maximum.
        </Tooltip>
      )}
    </span>
  );
};

export default ThemeSelectButton;
