import React, { useState, useEffect } from "react";
import { Modal } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Id } from "api-types";
import { needSelector } from "services/Needs/needs.selectors";
import { AvailableLanguageI18nCode } from "types/interface";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { Label } from "containers/Backend/Admin/sharedComponents/SubComponents";
import { saveNeedActionCreator } from "services/Needs/needs.actions";
import styles from "./TranslationNeedsModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  selectedNeedId?: Id;
  langueI18nCode: string;
}

export const OneNeedTranslationModal = (props: Props) => {
  const need = useSelector(needSelector(props.selectedNeedId));
  const dispatch = useDispatch();

  // rtl
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    setIsRTL(["ar", "ps", "fa"].includes(props.langueI18nCode));
  }, [props.langueI18nCode]);

  // values
  const [text, setText] = useState("");
  const [subtitle, setSubtitle] = useState("");
  useEffect(() => {
    const ln = props.langueI18nCode as AvailableLanguageI18nCode;
    if (ln && need?.[ln]) {
      setText(need[ln]?.text || "");
      setSubtitle(need[ln]?.subtitle || "");
    }
  }, [need, props.langueI18nCode]);

  // save
  const onTextChange = (e: any) => setText(e.target.value);
  const onSubtitleChange = (e: any) => setSubtitle(e.target.value);
  const onSave = () => {
    if (props.selectedNeedId && props.langueI18nCode) {
      dispatch(
        saveNeedActionCreator(props.selectedNeedId, {
          [props.langueI18nCode]: {
            text,
            subtitle,
            updatedAt: Date.now(),
          },
        }),
      );
    }
    props.toggle();
  };

  const hasError = !need || !props.selectedNeedId;
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
      size="md"
    >
      {!hasError ? (
        <>
          <div>
            <Label htmlFor="titleFr">Titre du besoin en français</Label>
            <FInput id="titleFr" value={need.fr.text} disabled={true} newSize={true} autoFocus={false} />
          </div>
          <div>
            <Label htmlFor="titleLn">Titre du besoin traduit</Label>
            <FInput id="titleLn" value={text} newSize={true} onChange={onTextChange} autoFocus={false} />
          </div>
          <div className="mt-5">
            <Label htmlFor="subtitleFr">Sous-titre du besoin en français</Label>
            <FInput id="subtitleFr" value={need.fr.subtitle} disabled={true} newSize={true} autoFocus={false} />
          </div>
          <div>
            <Label htmlFor="subtitleLn">Sous-titre du besoin traduit</Label>
            <FInput
              id="subtitleLn"
              value={subtitle}
              disabled={!need.fr.subtitle}
              newSize={true}
              onChange={onSubtitleChange}
              autoFocus={false}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="h5 my-2">Traduction d'un besoin : </h1>
          <p className="fw-bold mb-1">Une erreur est survenue</p>
        </>
      )}
      <div className="d-flex justify-content-end mt-5">
        <FButton className="me-2" type="white" name="close-outline" onClick={props.toggle}>
          Annuler
        </FButton>
        {!hasError && (
          <FButton className="me-2" type="validate" name="checkmark-outline" onClick={onSave} disabled={!text}>
            Enregistrer
          </FButton>
        )}
      </div>
    </Modal>
  );
};
