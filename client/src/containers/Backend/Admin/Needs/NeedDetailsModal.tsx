import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import "./NeedDetailsModal.scss";
import { Need } from "../../../../types/interface";
import styled from "styled-components";
import { getTagColor } from "./lib";
import { jsUcfirst } from "../../../../lib/index";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedNeed: Need | null;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  margin-bottom: 24px;
`;

const StyledTagName = styled.div`
  font-weight: bold;
  color: white;
`;

const StyledTagContainer = styled.div`
  background-color: ${(props) => props.color};
  padding: 12px;
  width: fit-content;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const NeedDetailsModal = (props: Props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.selectedNeed) {
      setValue(props.selectedNeed.fr.text);
    }
  }, []);

  const onSave = () => {
    props.toggleModal();
  };

  const onValueChange = (e: any) => setValue(e.target.value);
  if (!props.selectedNeed) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="need-details-modal"
      >
        <div>Erreur</div>
      </Modal>
    );
  }
  const tagColor = getTagColor(props.selectedNeed.tagName);

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="need-details-modal"
    >
      <Title>Modification d'un besoin</Title>
      <StyledTagContainer color={tagColor}>
        <StyledTagName>{jsUcfirst(props.selectedNeed.tagName)}</StyledTagName>
      </StyledTagContainer>
      <FInput
        autoFocus={false}
        id="website0"
        value={value}
        onChange={onValueChange}
        newSize={true}
        placeholder="Votre site internet"
      />
      <BottomRowContainer>
        <FButton
          className="mr-8"
          type="white"
          name="close-outline"
          onClick={props.toggleModal}
        >
          Annuler
        </FButton>
        <FButton
          className="mr-8"
          type="validate"
          name="checkmark-outline"
          onClick={onSave}
        >
          Enregistrer
        </FButton>
      </BottomRowContainer>
    </Modal>
  );
};
