import Badge from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { ListGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import { getPath } from "routes";
import { activatedLanguages } from "~/data/activatedLanguages";
import { useChangeLanguage } from "~/hooks";
import useLocale from "~/hooks/useLocale";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageModal.module.scss";
import { cls } from "~/lib/classname";

interface Props {
  show: boolean;
  toggle: () => void;
  currentLanguage: string;
  changeLanguage: (ln: string) => void;
  isLanguagesLoading: boolean;
  languages: GetLanguagesResponse[];
}

const LanguageModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = useLocale();
  const { changeLanguage } = useChangeLanguage();
  const langues = useSelector(allLanguesSelector);

  const getTranslationProgress = useCallback(
    (i18nCode: string) => {
      if (i18nCode === "fr") return 1;
      const language = langues.find((ln) => ln.i18nCode === i18nCode);
      return language ? Math.min(language.avancementTrad || 0, 1) : 0;
    },
    [langues],
  );

  const languagesOptions = (activatedLanguages || []).map((lang) => ({
    label: (
      <span className={styles.lang_name}>
        <span>
          <span className={styles.lang_name_bold}>{lang.langueFr}</span> - {lang.langueLoc}
        </span>
        <Badge as="span" noIcon severity={getTranslationProgress(lang.i18nCode) === 1 ? "success" : "new"}>
          {Math.round(getTranslationProgress(lang.i18nCode) * 100) + " %"}
        </Badge>
      </span>
    ),
    nativeInputProps: {
      checked: props.currentLanguage === lang.i18nCode,
      onChange: () => {
        changeLanguage(lang.i18nCode, "replace", props.toggle);
      },
    },
  }));

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader className={styles.modal_header}>
        <span className={styles.title}>{t("Homepage.change_language", "Quelle langue parlez-vous ?")}</span>
        <button className={styles.close_label} onClick={props.toggle}>
          {t("close", "Fermer")} <i className={cls(styles.close_icon, "ri-close-line")}></i>
        </button>
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <ListGroup>
          <RadioButtons options={languagesOptions} className={styles.radio} />

          {!isMobile && (
            <div className={styles.help_translate_container}>
              <p>{t("Homepage.traduire_text", "Vous pouvez nous aider à traduire !")}</p>
              <Button
                onClick={() => {
                  props.toggle();
                  setTimeout(() => {
                    router.push({
                      pathname: getPath("/traduire", locale),
                    });
                  }, 100);
                }}
              >
                {t("Homepage.traduire_button", "Traduire")}
              </Button>
            </div>
          )}
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default LanguageModal;
