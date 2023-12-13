import React, { memo } from "react";
import styled from "styled-components";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TagName from "components/UI/TagName";
import { onEnterOrSpace } from "lib/onEnterOrSpace";
import styles from "./ThemeDropdown.module.scss";
import { GetThemeResponse } from "@refugies-info/api-types";

type ButtonThemeProps = {
  color100: string;
  color30: string;
  $selected: boolean;
};
const ButtonTheme = styled.button<ButtonThemeProps>`
  background-color: ${(props) => (props.$selected ? props.color100 : "transparent")};
  :not(:disabled):hover {
    background-color: ${(props) => (props.$selected ? props.color100 : props.color30)} !important;
    border-color: ${(props) => props.color100};
    color: ${(props) => props.color100};
  }

  @media screen and (max-width: 767px) {
    background-color: ${(props) => (props.$selected ? props.color100 : "transparent")} !important;
    color: white !important;
    ${(props) => (props.$selected ? "border-color: white !important;" : "")}

    :hover {
      background-color: transparent;
    }
  }
`;

interface Props {
  theme: GetThemeResponse;
  selected: boolean;
  disabled: boolean;
  mobile: boolean;
  nbNeeds: number | undefined;
  onClick: () => void;
}

const ThemeButton = ({ theme, selected, disabled, nbNeeds, mobile, onClick }: Props) => {
  return (
    <ButtonTheme
      className={styles.btn}
      color100={theme.colors.color100}
      color30={theme.colors.color30}
      $selected={selected}
      onClick={onClick}
      onKeyDown={(e) => onEnterOrSpace(e, onClick, ["ArrowRight"])}
      disabled={disabled}
      tabIndex={0}
    >
      <span className={styles.btn_content}>
        <TagName theme={theme} colored={!selected} size={20} />
        {nbNeeds && nbNeeds > 0 && (
          <span
            style={{
              backgroundColor: !selected ? theme.colors.color100 : "white",
              color: !selected ? "white" : theme.colors.color100,
            }}
            className={styles.theme_badge}
          >
            {nbNeeds || 0}
          </span>
        )}
      </span>
      {(mobile || selected) && (
        <EVAIcon
          name={!mobile ? "chevron-right-outline" : selected ? "chevron-up-outline" : "chevron-down-outline"}
          fill={selected ? "white" : theme.colors.color100}
          className="ms-2"
        />
      )}
    </ButtonTheme>
  );
};

export default memo(ThemeButton);
