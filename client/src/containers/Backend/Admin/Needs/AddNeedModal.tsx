import React, { useState } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import FButton from "components/UI/FButton/FButton";
import FInput from "components/UI/FInput/FInput";
import { TagButton } from "./TagButton";
import { useDispatch, useSelector } from "react-redux";
import { createNeedActionCreator } from "services/Needs/needs.actions";
import styles from "./NeedDetailsModal.module.scss";
import { themesSelector } from "services/Themes/themes.selectors";

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
  const [themeSelected, setThemeSelected] = useState<null | string>(null);
  const themes = useSelector(themesSelector);

  const dispatch = useDispatch();

  const onSave = () => {
    if (value && themeSelected) {
      dispatch(createNeedActionCreator({ name: value, theme: themeSelected }));
    }
    props.toggleModal();
  };

  const onValueChange = (e: any) => setValue(e.target.value);

  const onThemeClick = (themeId: string) => {
    if (themeSelected === themeId) {
      setThemeSelected(null);
      return;
    }
    setThemeSelected(themeId);
    return;
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <Title>Ajouter un nouveau besoin</Title>
      <SubTitle>Choix du thème*</SubTitle>
      <TagsContainer>
        {themes.map((theme) => (
          <TagButton
            key={theme.short.fr}
            name={theme.short.fr}
            icon={theme.icon}
            isSelected={!themeSelected || themeSelected === theme._id.toString()}
            color={theme.colors.color100}
            onClick={() => onThemeClick(theme._id.toString())}
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
          disabled={!themeSelected || !value}
        >
          Enregistrer
        </FButton>
      </BottomRowContainer>
    </Modal>
  );
};
