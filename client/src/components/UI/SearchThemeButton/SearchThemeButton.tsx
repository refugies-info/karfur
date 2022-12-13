import React from "react";
import Image from "next/legacy/image";
import styled from "styled-components";
import { jsUcfirst } from "lib";
import { cls } from "lib/classname";
import { Theme } from "types/interface";
import useLocale from "hooks/useLocale";
import styles from "./SearchThemeButton.module.scss";

interface Props {
  theme: Theme;
  onClick?: () => void;
}

type ThemeLinkProps = {
  color100: string;
  color80: string;
  color30: string;
};
const ThemeLink = styled.button`
  background: ${(props: ThemeLinkProps) => `linear-gradient(90deg, ${props.color100} 22%, ${props.color80} 100%)`};

  :hover {
    background: ${(props: ThemeLinkProps) => props.color30};
    box-shadow: 0 0 0 1px ${(props: ThemeLinkProps) => props.color100}, 0 0 40px 0 #00000040;
    color: ${(props: ThemeLinkProps) => props.color100} !important;
  }
`;

const SearchThemeButton = (props: Props) => {
  const locale = useLocale();

  return (
    <ThemeLink
      className={cls(styles.btn)}
      color100={props.theme.colors.color100}
      color80={props.theme.colors.color80}
      color30={props.theme.colors.color30}
      onClick={() => {
        if (props.onClick) props.onClick();
        window.scrollTo(0, 0);
      }}
    >
      <span className="mr-4">{jsUcfirst(props.theme.short[locale] || "")}</span>
      <div className={styles.image}>
        {props.theme?.appImage?.secure_url && (
          <span className={styles.image_inner}>
            <Image src={props.theme.appImage.secure_url} width={65} height={90} alt="" />
          </span>
        )}
      </div>
    </ThemeLink>
  );
};
export default SearchThemeButton;
