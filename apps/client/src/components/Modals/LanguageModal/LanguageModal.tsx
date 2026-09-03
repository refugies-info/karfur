import { Button } from "@codegouvfr/react-dsfr/Button";
import type { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { isMobile } from "react-device-detect";
import { ListGroupItem, Modal, ModalBody } from "reactstrap";
import { getPath } from "routes";
import { LanguageSelector } from "~/components/UI/LanguageSelector";
import useLocale from "~/hooks/useLocale";
import { cn } from "~/lib/classname";
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
  const locale = useLocale();

  // The modal width and height are bounded by the viewport in the stylesheet:
  // at 200 % text zoom it overflowed on the right, and in a 256 px tall viewport
  // it was cut off at the bottom with no way to reach the end of the list
  // (RGAA 10.4 and 10.11).
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      labelledBy="language-modal-title"
      className={cn(styles.modal)}
      contentClassName={cn(styles.modal_content)}
    >
      <ModalBody className={cn(styles.modal_body)}>
        <div className="flex flex-col gap-8">
          <Button
            onClick={props.toggle}
            className="!ms-auto translate-x-4 whitespace-nowrap"
            iconId="fr-icon-close-line"
            priority="tertiary no outline"
            iconPosition="right"
            size="small"
          >
            {t("close", "Fermer")}
          </Button>
          <h5 id="language-modal-title" className={cn(styles.title)}>
            {t("Homepage.modalLangTitle", "Quelle langue parlez-vous ?")}
          </h5>
        </div>

        <LanguageSelector onChangeLang={props.toggle} itemsDesign="radio" />

        {!isMobile && (
          <ListGroupItem
            action
            tag="div"
            className={styles.list_group_item + " " + styles.unavailable}
          >
            {/* The reactstrap Col xs=8 / xs=4 grid had no responsive variant: below
                380 px the button did not fit in its quarter and overlapped the
                text. A wrapping flex container fixes both (RGAA 10.11). */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="mb-0">
                {t("Homepage.traduire", "Vous pouvez nous aider à traduire !")}
              </p>
              <Button
                linkProps={{
                  href: getPath("/traduire", locale),
                  prefetch: false,
                  onClick: props.toggle,
                }}
              >
                {t("Homepage.btnTranslate", "Traduire")}
              </Button>
            </div>
          </ListGroupItem>
        )}
      </ModalBody>
    </Modal>
  );
};

export default LanguageModal;
