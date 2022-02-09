import React, { useState } from "react";
import { Modal } from "reactstrap";
// import "./NeedDetailsModal.scss";
import styled from "styled-components";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import { TagButton } from "./TagButton";
import { useDispatch } from "react-redux";
import { createNeedActionCreator } from "services/Needs/needs.actions";
import { tags } from "data/tags";

interface Props {
  show: boolean;
  toggleModal: () => void;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  margin-bottom: 24px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`;

const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: flex-end;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -4px;
  margin-right: -4px;
  margin-bottom: 8px;
`;
export const AddNeedModal = (props: Props) => {
  const [value, setValue] = useState("");
  const [tagSelected, setTagSelected] = useState<null | string>(null);

  const dispatch = useDispatch();

  const onSave = () => {
    if (value && tagSelected) {
      dispatch(createNeedActionCreator({ name: value, tag: tagSelected }));
    }
    props.toggleModal();
  };

  const onValueChange = (e: any) => setValue(e.target.value);

  const onTagClick = (tagName: string) => {
    if (tagSelected === tagName) {
      setTagSelected(null);
      return;
    }
    setTagSelected(tagName);
    return;
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="need-details-modal"
    >
      <Title>Ajouter un nouveau besoin</Title>
      <SubTitle>Choix du thème*</SubTitle>
      <TagsContainer>
        {tags.map((tag) => (
          <TagButton
            key={tag.short}
            name={tag.short}
            icon={tag.icon}
            isSelected={!tagSelected || tagSelected === tag.name}
            color={tag.darkColor}
            onClick={() => onTagClick(tag.name)}
          />
        ))}
      </TagsContainer>

      <SubTitle>Nom du besoin*</SubTitle>
      <FInput
        id="need-name"
        autoFocus={false}
        value={value}
        onChange={onValueChange}
        newSize={true}
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
          disabled={!tagSelected || !value}
        >
          Enregistrer
        </FButton>
      </BottomRowContainer>
    </Modal>
  );
};
