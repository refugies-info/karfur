import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SearchInput.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";

interface Props {
  label: string;
  icon: string;
  active: boolean;
  setActive: (active: boolean) => void
}

const SearchInput = (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const setFocus = () => {
    ref.current?.focus();
  };

  const handleFocusIn = useCallback(() => {
    props.setActive(document.activeElement === ref.current);
  }, []);

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("focusout", handleFocusIn)
    return () => {
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("focusout", handleFocusIn)
  };
  }, [handleFocusIn])

  return (
    <div className={cls(styles.filter, props.active && styles.active)} onClick={setFocus}>
      <span className={cls(styles.icon, props.active && styles.active)}>
        <EVAIcon
          name={props.icon}
          fill={props.active ? "white" : "black"}
          size="large"
        />
      </span>
      <span>
        <label className={styles.label} htmlFor={props.label}>{props.label}</label>
        <input ref={ref} id={props.label} type="text" placeholder="Rechercher..." className={styles.input} />
      </span>
    </div>
  )
};

export default SearchInput;
