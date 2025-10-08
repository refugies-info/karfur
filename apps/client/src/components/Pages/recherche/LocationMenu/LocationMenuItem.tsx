import React, { useCallback } from "react";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import styles from "./LocationMenuItem.module.css";

export type LocationMenuItemType = "department" | "commonPlace" | "place";

interface Props {
  type: LocationMenuItemType;
  checked?: boolean;
  label: string;
  ariaLabel?: string;
  className?: string;
  onChange: () => void;
}

const LocationMenuItem: React.FC<Props> = ({ type, checked = false, label, ariaLabel, className, onChange }) => {
  const handleChange = useCallback(() => {
    onChange();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
      onEnterOrSpace(e, onChange);
    },
    [onChange],
  );

  const containerClass = className || (type === "place" ? styles.item : styles.container);

  return (
    <label className={containerClass}>
      <input type="radio" checked={checked} aria-label={ariaLabel} onKeyDown={handleKeyDown} onChange={handleChange} />
      <span className={type === "place" ? undefined : styles.label}>{label}</span>
    </label>
  );
};

export default LocationMenuItem;
