import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { checkIfEllipsis } from "lib/checkIfEllipsis";
import useWindowSize from "hooks/useWindowSize";
import { colors } from "colors";
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
  smallIcon?: boolean;
  noInput?: boolean;
  noEmptyBtn?: boolean;
  onHomepage?: boolean;
}

const SearchInput = (props: Props) => {
  const { t } = useTranslation();
  const { active, setActive, resetFilter } = props;
  const ref = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useWindowSize();

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

  // ellipsis
  const [hasEllipsis, setHasEllipsis] = useState(false);
  useEffect(() => {
    if (props.value && !active && valueRef.current) {
      setHasEllipsis(checkIfEllipsis(valueRef.current));
    }
  }, [props.value, active]);

  const onClickCross = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (resetFilter) resetFilter();
    },
    [resetFilter]
  );

  const isActive = active || !!props.value;
  const countValues = !props.value ? 0 : (props.value.match(/,/g) || []).length + 1;

  const getIconColor = useCallback(() => {
    if (isMobile && props.smallIcon && !props.onHomepage) return isActive ? colors.bleuCharte : "black";
    return isActive ? "white" : "black";
  }, [isActive, isMobile, props.smallIcon, props.onHomepage]);

  return (
    <div
      className={cls(styles.filter, active && styles.active, props.onHomepage ? styles.homepage : styles.searchpage)}
    >
      <span className={cls(styles.icon, isActive && styles.active, props.smallIcon && styles.small)}>
        <EVAIcon name={props.icon} fill={getIconColor()} size={props.smallIcon || props.onHomepage ? 20 : 24} />
      </span>
      <span className={styles.search}>
        <label className={styles.label} htmlFor={props.label}>
          {props.label}
        </label>
        {active && !props.noInput ? (
          <>
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
            {props.inputValue && (
              <div className={styles.empty_btn}>
                <EVAIcon name="close-outline" fill="dark" onClick={onClickCross} size={20} />
              </div>
            )}
          </>
        ) : (
          <>
            <div ref={valueRef} className={cls(styles.value, !props.value && styles.empty)}>
              {props.value || props.placeholder}
              {hasEllipsis && props.value && <span className={styles.plus}>({countValues})</span>}
            </div>
            {props.value && !props.noEmptyBtn && (
              <div className={styles.empty_btn}>
                <EVAIcon name="close-outline" fill="dark" onClick={onClickCross} size={20} />
              </div>
            )}
          </>
        )}
      </span>
    </div>
  );
};

export default SearchInput;
