import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { jsUcfirst } from "lib";
import { cls } from "lib/classname";
import useLocale from "hooks/useLocale";
import styles from "./SearchThemeButton.module.scss";
import { GetThemeResponse } from "@refugies-info/api-types";

type ThemeButtonProps = {
  $color100: string;
  $color80: string;
  $color30: string;
};
const ThemeButton = styled.button<ThemeButtonProps>`
  background: ${(props) => `linear-gradient(90deg, ${props.$color100} 22%, ${props.$color80} 100%)`};

  :hover {
    background: ${(props) => props.$color30};
    box-shadow: 0 0 0 1px ${(props) => props.$color100}, 0 0 40px 0 #00000040;
    color: ${(props) => props.$color100} !important;
  }
`;

const ThemeLink = styled(Link)<ThemeButtonProps>`
  background: ${(props) => `linear-gradient(90deg, ${props.$color100} 22%, ${props.$color80} 100%)`} !important;

  :hover {
    background: ${(props) => props.$color30} !important;
    box-shadow: 0 0 0 1px ${(props) => props.$color100}, 0 0 40px 0 #00000040;
    color: ${(props) => props.$color100} !important;
  }
`;

interface Props {
  theme: GetThemeResponse;
  onClick?: () => void;
  href?: string;
  small?: boolean;
  className?: string;
}

const SearchThemeButton = (props: Props) => {
  const locale = useLocale();

  const content = useMemo(
    () => (
      <>
        <span className="me-4">{jsUcfirst(props.theme.short[locale] || "")}</span>
        <span className={styles.image}>
          {props.theme?.appImage?.secure_url && (
            <span className={styles.image_inner}>
              <Image
                src={props.theme.appImage.secure_url}
                width={props.small ? 32 : 65}
                height={props.small ? 41 : 90}
                alt=""
              />
            </span>
          )}
        </span>
      </>
    ),
    [locale, props.theme, props.small],
  );

  return props.href ? (
    <ThemeLink
      className={cls(styles.btn, props.small && styles.sm, props.className)}
      $color100={props.theme.colors.color100}
      $color80={props.theme.colors.color80}
      $color30={props.theme.colors.color30}
      href={props.href}
      onClick={props.onClick}
    >
      {content}
    </ThemeLink>
  ) : (
    <ThemeButton
      className={cls(styles.btn, props.small && styles.sm, props.className)}
      $color100={props.theme.colors.color100}
      $color80={props.theme.colors.color80}
      $color30={props.theme.colors.color30}
      onClick={() => {
        if (props.onClick) props.onClick();
        window.scrollTo(0, 0);
      }}
    >
      {content}
    </ThemeButton>
  );
};
export default SearchThemeButton;
