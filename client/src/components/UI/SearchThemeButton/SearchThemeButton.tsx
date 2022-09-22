import { jsUcfirst } from "lib";
import { cls } from "lib/classname";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Theme } from "types/interface";
import styles from "./SearchThemeButton.module.scss";

interface Props {
  theme: Theme;
  link: string;
  onClick?: () => void;
}

type ThemeLinkProps = {
  color100: string;
  color80: string;
  color30: string;
};
const ThemeLink = styled.a`
  background: ${(props: ThemeLinkProps) => `linear-gradient(90deg, ${props.color100} 22%, ${props.color80} 100%)`};

  :hover {
    background: ${(props: ThemeLinkProps) => props.color30};
    box-shadow: 0 0 0 2px ${(props: ThemeLinkProps) => props.color100};
    color: ${(props: ThemeLinkProps) => props.color100} !important;
  }
`;

const SearchThemeButton = (props: Props) => (
  <Link href={props.link}>
    <ThemeLink
      className={cls(styles.btn)}
      color100={props.theme.colors.color100}
      color80={props.theme.colors.color80}
      color30={props.theme.colors.color30}
      onClick={props.onClick}
    >
      <span className="mr-4">{jsUcfirst(props.theme.name.fr)}</span>
      <div className={styles.image}>
        {props.theme?.appImage?.secure_url && (
          <span className={styles.image_inner}>
            <Image src={props.theme.appImage.secure_url} width={65} height={90} alt="" />
          </span>
        )}
      </div>
    </ThemeLink>
  </Link>
);

export default SearchThemeButton;
