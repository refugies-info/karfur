import { DispositifContent } from "../../../../types/interface";
import React from "react";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

interface Props {
  subitem: DispositifContent;
  disableEdit: boolean;
  footerClicked: (arg: DispositifContent) => void;
  t: any;
  toggleFrenchLevelModal: (arg: boolean) => void;
}

const ButtonText = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin: 0;
`;

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
        <ButtonText>Préciser le niveau</ButtonText>
      </FButton>
    );
  }
  return <div></div>;
};
