import React from "react";

import styles from "./FSearchBtn.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {
  className?: string
  active?: boolean
  color?: string
  desactiver?: any
  children?: any
  inHeader?: boolean
  filter?: boolean
  extraPadding?: boolean
  withMargins?: boolean
  searchOption?: boolean
  [x: string]: any
}

const FSearchBtn = (props: Props) => {
  let {
    className,
    active,
    color,
    inHeader,
    children,
    filter,
    extraPadding,
    withMargins,
    searchOption,
    ...bProps
  } = props;

  return (
    <button
      className={
        [styles.search_btn,
        (active ? styles.active : ""),
        (inHeader ? styles.in_header : ""),
        (filter ? styles.filter : ""),
        (extraPadding ? styles.extra_padding : ""),
        (withMargins ? styles.with_margins : ""),
        (searchOption ? styles.search_option : ""),
        (color ? styles.color + (" bg-" + color) : "")].join(" ")
      }
      {...bProps}
    >
      {children}
      {active && (
        <EVAIcon
          className="ml-10"
          name="close-outline"
          onClick={props.desactiver || null}
        />
      )}
    </button>
  );
};

export default FSearchBtn;
