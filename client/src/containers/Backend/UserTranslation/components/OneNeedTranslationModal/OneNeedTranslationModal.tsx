import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Id, Languages, NeedRequest } from "@refugies-info/api-types";
import { needSelector } from "services/Needs/needs.selectors";
import { saveNeedActionCreator } from "services/Needs/needs.actions";
import BaseModal from "components/UI/BaseModal";
import Button from "components/UI/Button";
import ThemeIcon from "components/UI/ThemeIcon";
import Flag from "components/UI/Flag";
import styles from "./OneNeedTranslationModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  selectedNeedId: null | Id;
  langueI18nCode: Languages;
  countryCode?: string;
}

const OneNeedTranslationModal = (props: Props) => {
  const need = useSelector(needSelector(props.selectedNeedId));
  const dispatch = useDispatch();

  // rtl
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    setIsRTL(["ar", "ps", "fa"].includes(props.langueI18nCode));
  }, [props.langueI18nCode]);

  // values
  const [text, setText] = useState(need?.[props.langueI18nCode]?.text || "");
  const [subtitle, setSubtitle] = useState(need?.[props.langueI18nCode]?.subtitle || "");
  useEffect(() => {
    if (need?.[props.langueI18nCode]) {
      setText(need[props.langueI18nCode]?.text || "");
      setSubtitle(need[props.langueI18nCode]?.subtitle || "");
    }
  }, [need, props.langueI18nCode]);

  // save
  const onTextChange = (e: any) => setText(e.target.value);
  const onSubtitleChange = (e: any) => setSubtitle(e.target.value);
  const onSave = () => {
    if (props.selectedNeedId) {
      const body: Partial<NeedRequest> = {
        [props.langueI18nCode]: {
          text,
          subtitle,
          updatedAt: new Date().toISOString(),
        },
      };
      dispatch(saveNeedActionCreator(props.selectedNeedId, body));
    }
    props.toggle();
  };

  const hasError = !need || !props.selectedNeedId;
  return (
    <BaseModal show={props.show} toggle={props.toggle} small title="">
      {need?.theme && (
        <span className={styles.theme} style={{ backgroundColor: need.theme.colors.color100 }}>
          <ThemeIcon theme={{ ...need.theme, active: true }} size={16} />
          <span className="ms-2">{need.theme.short.fr}</span>
        </span>
      )}

      {!hasError ? (
        <>
          <div>
            <label className={styles.label} htmlFor="title">
              Titre du besoin
            </label>
            <div className={styles.flag_input}>
              <Flag langueCode="fr" className={styles.flag} />
              <input id="titleFr" className={styles.input} value={need.fr.text} disabled={true} autoFocus={false} />
            </div>
            <div className={styles.flag_input}>
              <Flag langueCode={props.countryCode} className={styles.flag} />
              <input id="title" className={styles.input} value={text} onChange={onTextChange} autoFocus={false} />
            </div>
          </div>
          <div className="mt-5">
            <label className={styles.label} htmlFor="subtitle">
              Description du besoin
            </label>
            <div className={styles.flag_input}>
              <Flag langueCode="fr" className={styles.flag} />
              <input
                id="subtitleFr"
                className={styles.input}
                value={need.fr.subtitle}
                disabled={true}
                autoFocus={false}
              />
            </div>
            <div className={styles.flag_input}>
              <Flag langueCode={props.countryCode} className={styles.flag} />
              <input
                id="subtitle"
                className={styles.input}
                value={subtitle}
                disabled={!need.fr.subtitle}
                onChange={onSubtitleChange}
                autoFocus={false}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="fw-bold mb-1">Une erreur est survenue</p>
      )}
      <div className="text-end mt-6">
        <Button
          priority="secondary"
          onClick={props.toggle}
          evaIcon="close-outline"
          iconPosition="right"
          className="me-4"
        >
          Annuler
        </Button>
        <Button evaIcon="checkmark-circle-2" iconPosition="right" onClick={onSave} disabled={!text}>
          Valider
        </Button>
      </div>
    </BaseModal>
  );
};

export default OneNeedTranslationModal;
