import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import type React from "react";
import { Modal } from "reactstrap";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import Image from "~/components/UI/Image";
import { useContentLocale } from "~/hooks";
import { cls } from "~/lib/classname";
import styles from "./BaseModal.module.scss";

interface Props {
  show: boolean;
  toggle?: () => void;
  className?: string;
  help?: {
    title: string;
    content: string | string[] | React.ReactNode;
  };
  title: string | React.ReactNode;
  children: React.ReactNode;
  small?: boolean;
  onOpened?: () => void;
}

const BaseModal = ({ show, toggle, className, help, title, children, small, onOpened }: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useContentLocale();

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      className={cls(styles.modal, small && styles.small, className || "")}
      contentClassName={styles.modal_content}
      onOpened={onOpened}
    >
      <div className={styles.container} dir={isRTL ? undefined : "ltr"}>
        {help && (
          <div className={styles.sidebar}>
            <Image src={TutoImg} width={47} height={32} alt="" />
            <p className={styles.title}>{help.title}</p>
            <div className={styles.text}>
              {Array.isArray(help.content)
                ? help.content.map((p, i) => <p key={i}>{p}</p>)
                : help.content}
            </div>
          </div>
        )}
        <div className={styles.content}>
          {toggle && (
            <div className="text-end">
              <Button
                iconId="fr-icon-close-line"
                className="translate-x-4"
                iconPosition="right"
                size="small"
                priority="tertiary no outline"
                onClick={toggle}
              >
                {t("close")}
              </Button>
            </div>
          )}
          <p className={cls(styles.title, !toggle && "mt-4")}>{title}</p>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;
