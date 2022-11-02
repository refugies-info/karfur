import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { checkIfEllipsis } from "lib/checkIfEllipsis";
import styles from "./SearchInput.module.scss";

interface Props {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  inputValue: string;
  inputPlaceholder?: string;
  active: boolean;
  setActive: (active: boolean) => void;
  onChange?: (e: any) => void;
  loading?: boolean;
  focusout?: boolean;
  resetFilter?: () => void;
}

const SearchInput = (props: Props) => {
  const { t } = useTranslation();
  const { active, setActive } = props;
  const ref = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);

  const handleFocusOut = useCallback(() => {
    if (active) setActive(false);
  }, [setActive, active]);

  // prevent close on click input
  useEffect(() => {
    const input = ref.current;
    const handleClick = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    };
    if (input) input.addEventListener("click", handleClick);
    return () => {
      if (input) input.removeEventListener("click", handleClick);
    };
  }, [active]);

  // handle focusout
  useEffect(() => {
    if (props.focusout) document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [handleFocusOut, props.focusout]);

  const hasBlueIcon = active || !!props.value;

  // ellipsis
  const [hasEllipsis, setHasEllipsis] = useState(false);
  useEffect(() => {
    if (props.value && !active && valueRef.current) {
      setHasEllipsis(checkIfEllipsis(valueRef.current));
    }
  }, [props.value, active]);

  const countValues = !props.value ? 0 : (props.value.match(/,/g) || []).length + 1;

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
            placeholder={props.inputPlaceholder || t("Rechercher2", "Rechercher...")}
            className={styles.input}
            onChange={props.onChange}
            value={props.inputValue}
            autoFocus
          />
        ) : (
          <>
            <div ref={valueRef} className={cls(styles.value, !props.value && styles.empty)}>
              {props.value || props.placeholder}
              {hasEllipsis && props.value && <span className={styles.plus}>({countValues})</span>}
            </div>
            {props.value && (
              <div className={styles.empty_btn}>
                <EVAIcon
                  name="close-outline"
                  fill="dark"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    if (props.resetFilter) props.resetFilter();
                  }}
                  size={20}
                />
              </div>
            )}
          </>
        )}
      </span>
    </div>
  );
};

export default SearchInput;
