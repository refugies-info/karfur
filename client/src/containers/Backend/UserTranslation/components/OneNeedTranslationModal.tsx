import React, { useState, useEffect } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { ObjectId } from "mongodb";
import { needSelector } from "services/Needs/needs.selectors";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { saveNeedActionCreator } from "services/Needs/needs.actions";
import styles from "./TranslationNeedsModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  selectedNeedId: null | ObjectId;
  langueI18nCode: string;
}

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 8px;
  margin-right: 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
`;

const NeedTextFr = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
`;

const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const OneNeedTranslationModal = (props: Props) => {
  const [value, setValue] = useState("");
  const need = useSelector(needSelector(props.selectedNeedId));

  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    setIsRTL(["ar", "ps", "fa"].includes(props.langueI18nCode));
  }, [props.langueI18nCode]);

  useEffect(() => {
    if (
      need &&
      props.langueI18nCode &&
      //@ts-ignore
      need[props.langueI18nCode] &&
      //@ts-ignore
      need[props.langueI18nCode].text
    ) {
      //@ts-ignore
      setValue(need[props.langueI18nCode].text);
    }
  }, []);

  const onValueChange = (e: any) => setValue(e.target.value);
  const dispatch = useDispatch();

  const onSave = () => {
    if (props.selectedNeedId && props.langueI18nCode) {
      dispatch(
        saveNeedActionCreator({
          _id: props.selectedNeedId,
          [props.langueI18nCode]: { text: value, updatedAt: Date.now() },
        })
      );
    }
    props.toggle();
  };

  if (!need || !props.selectedNeedId) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
        size="md"
      >
        <Header>{"Traduction d'un besoin : "}</Header>
        <Title>Une erreur est survenue</Title>
        <BottomRowContainer>
          <FButton
            className="mr-8"
            type="white"
            name="close-outline"
            onClick={props.toggle}
          >
            Annuler
          </FButton>
        </BottomRowContainer>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
      size="md"
    >
      <Title>Version française : </Title>
      <NeedTextFr>{need.fr.text}</NeedTextFr>
      <Title>Version traduite :</Title>
      <div dir={isRTL ? "rtl" : ""}>
        <FInput id="translated-version" value={value} onChange={onValueChange} newSize={true} />
      </div>
      <BottomRowContainer>
        <FButton
          className="mr-8"
          type="white"
          name="close-outline"
          onClick={props.toggle}
        >
          Annuler
        </FButton>
        <FButton
          className="mr-8"
          type="validate"
          name="checkmark-outline"
          onClick={onSave}
          disabled={!value}
        >
          Enregistrer
        </FButton>
      </BottomRowContainer>
    </Modal>
  );
};
