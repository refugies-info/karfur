import { Button } from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { ListGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import { getPath } from "routes";
import { activatedLanguages } from "~/data/activatedLanguages";
import { useChangeLanguage } from "~/hooks";
import useLocale from "~/hooks/useLocale";
import styles from "./LanguageModal.module.scss";

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

  const languagesOptions = (activatedLanguages || []).map((lang) => ({
    label: `${lang.langueFr} - ${lang.langueLoc}`,
    nativeInputProps: {
      checked: props.currentLanguage === lang.i18nCode,
      onChange: () => {
        changeLanguage(lang.i18nCode, "replace", props.toggle);
      },
    },
  }));

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={props.toggle} className={styles.modal_header}>
        <span className={styles.title}>{t("Homepage.change_language", "Quelle langue parlez-vous ?")}</span>
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
