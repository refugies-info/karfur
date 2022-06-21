import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./FilterButton.module.scss";

interface Props {
  active: boolean
  className?: string
  color?: string
  children?: any
  [x: string]: any
}

const FilterButton = React.forwardRef((props: Props, ref) => {
  let {
    className,
    active,
    color,
    ...bProps
  } = props;

  const classNames = cls(
    styles.btn,
    active && styles.active,
    !!color && styles.colored,
    className || "",
  );

  return (
    <button
      className={classNames}
      style={color ? {backgroundColor: color}: {}}
      {...bProps}
    >
      {props.children}
      {active && (
        <EVAIcon
          className={styles.close}
          name="close-outline"
          fill="white"
        />
      )}
    </button>
  );
});

FilterButton.displayName = "FilterButton";

export default FilterButton;
