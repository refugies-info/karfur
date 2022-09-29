import React, { useCallback, useEffect, useRef } from "react";
import { Button } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./SearchInput.module.scss";

interface Props {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  inputValue: string;
  active: boolean;
  setActive: (active: boolean) => void;
  onChange?: (e: any) => void;
  loading?: boolean;
  focusout?: boolean;
  resetFilter?: () => void;
}

const SearchInput = (props: Props) => {
  const { active, setActive } = props;
  const ref = useRef<HTMLInputElement | null>(null);

  const handleFocusOut = useCallback(() => {
    if (active) setActive(false);
  }, [setActive, active]);

  useEffect(() => {
    if (props.focusout) document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [handleFocusOut, props.focusout]);

  const hasBlueIcon = active || !!props.value;

  return (
    <div className={cls(styles.filter, active && styles.active)}>
      <span className={cls(styles.icon, hasBlueIcon && styles.active)}>
        <EVAIcon name={props.icon} fill={hasBlueIcon ? "white" : "black"} size="large" />
      </span>
      <span className={styles.search}>
        <label className={styles.label} htmlFor={props.label}>
          {props.label}
        </label>
        {active ? (
          <input
            ref={ref}
            id={props.label}
            type="text"
            placeholder="Rechercher..."
            className={styles.input}
            onChange={props.onChange}
            value={props.inputValue}
            autoFocus
          />
        ) : (
          <div className={cls(styles.value, !props.value && styles.empty)}>
            {props.value || props.placeholder}
            {props.value && (
              <Button className={styles.empty_btn}>
                <EVAIcon
                  name="close-outline"
                  fill="dark"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    if (props.resetFilter) props.resetFilter();
                  }}
                  size={20}
                />
              </Button>
            )}
          </div>
        )}
      </span>
    </div>
  );
};

export default SearchInput;
