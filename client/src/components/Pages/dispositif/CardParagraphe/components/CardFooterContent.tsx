import { DispositifContent } from "types/interface";
import React from "react";
import FButton from "components/UI/FButton/FButton";
import { isMobile } from "react-device-detect";
import styles from "./CardFooterContent.module.scss";

interface Props {
  subitem: DispositifContent;
  disableEdit: boolean;
  footerClicked: (arg: DispositifContent) => void;
  t: any;
  toggleFrenchLevelModal: (arg: boolean) => void;
}

export const CardFooterContent = (props: Props) => {
  // in lecture mode, display button with a link to evaluate french level in infocard Niveau de français
  if (
    props.subitem.title === "Niveau de français" &&
    props.disableEdit &&
    !isMobile
  ) {
    return (
      <FButton
        type="light-action"
        name={props.subitem.footerIcon}
        onClick={() => props.footerClicked(props.subitem)}
      >
        {props.subitem.footer &&
          props.t("Dispositif." + props.subitem.footer, props.subitem.footer)}
      </FButton>
    );
  }

  if (!props.disableEdit && props.subitem.title === "Niveau de français") {
    return (
      <FButton
        type="precision"
        name="plus-circle-outline"
        onClick={() => props.toggleFrenchLevelModal(true)}
      >
        <p className={styles.btn_text}>Préciser le niveau</p>
      </FButton>
    );
  }
  return <div></div>;
};
