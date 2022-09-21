import React from "react";
import styles from "./SeeMoreButton.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { Button } from "reactstrap";

interface Props {
  onClick: () => void
  visible: boolean
}

const SeeMoreButton = (props: Props) => {
  return (
    <div className={cls(styles.container, props.visible && styles.visible)}>
      <Button
        onClick={props.onClick}
        className={styles.btn}
      >
        {!props.visible ? "Voir plus" : "Voir moins"}
        <EVAIcon
          name={!props.visible ? "arrow-downward-outline" : "arrow-upward-outline"}
          fill="white"
          size={24}
          className="ml-2"
        />
      </Button>
    </div>
  );
};

export default SeeMoreButton;
