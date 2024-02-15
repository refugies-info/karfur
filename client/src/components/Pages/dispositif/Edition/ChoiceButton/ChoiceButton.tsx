import React, { useMemo, useState } from "react";
import Image from "next/image";
import uniqueId from "lodash/uniqueId";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Tooltip from "components/UI/Tooltip";
import styles from "./ChoiceButton.module.scss";
import { cls } from "lib/classname";

interface Props {
  text: string | React.ReactNode;
  subtext?: string;
  selected: boolean;
  onSelect: () => void;
  image?: any;
  illuComponent?: React.ReactNode;
  type: "radio" | "checkbox";
  size?: "lg" | "sm";
  className?: string;
  helpTooltip?: string;
}

/**
 * Button used to make a choice. Can be of multiple sizes, a radio or a checkbox, and accepts images.
 */
const ChoiceButton = (props: Props) => {
  const iconName = useMemo(() => {
    if (props.type === "radio") return props.selected ? "radio-button-on" : "radio-button-off";
    return props.selected ? "checkmark-square-2" : "square";
  }, [props.selected, props.type]);
  const [tooltipId] = useState(uniqueId("tooltip_"));

  return (
    <button
      className={cls(
        styles.choice,
        props.size && styles[props.size],
        (!!props.image || !!props.illuComponent) && styles.has_image,
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
      <span className={styles.text}>
        {props.text}
        {props.subtext && <span className={styles.subtext}>{props.subtext}</span>}
        {props.helpTooltip && (
          <>
            <EVAIcon
              name="question-mark-circle-outline"
              size={20}
              fill={styles.lightTextMentionGrey}
              className="ms-2"
              id={tooltipId}
            />
            <Tooltip target={tooltipId} placement="right" className={styles.tooltip}>
              {props.helpTooltip}
            </Tooltip>
          </>
        )}
      </span>

      {props.image && <Image src={props.image} width={48} height={48} alt="" />}
      {props.illuComponent || null}
    </button>
  );
};

export default ChoiceButton;
