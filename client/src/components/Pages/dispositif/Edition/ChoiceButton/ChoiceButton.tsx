import React, { useMemo } from "react";
import Image from "next/image";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./ChoiceButton.module.scss";
import { cls } from "lib/classname";

interface Props {
  text: string;
  selected: boolean;
  onSelect: () => void;
  image?: any;
  type: "radio" | "checkbox";
  size?: "xs" | "sm";
  className?: string;
}

const ChoiceButton = (props: Props) => {
  const iconName = useMemo(() => {
    if (props.type === "radio") return props.selected ? "radio-button-on" : "radio-button-off";
    return props.selected ? "checkmark-square-2" : "square";
  }, [props.selected, props.type]);

  return (
    <button
      className={cls(
        styles.choice,
        props.size && styles[props.size],
        props.selected && styles.selected,
        props.className,
      )}
      onClick={(e: any) => {
        e.preventDefault();
        props.onSelect();
      }}
    >
      <EVAIcon
        name={iconName}
        size={20}
        fill={props.selected ? styles.lightTextActionHighBlueFrance : styles.lightTextTitleGrey}
        className="me-2"
      />
      <span className={styles.text}>{props.text}</span>
      {props.image && <Image src={props.image} width={48} height={48} alt="" />}
    </button>
  );
};

export default ChoiceButton;
