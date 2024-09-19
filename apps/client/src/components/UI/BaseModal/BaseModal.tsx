import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import { Modal } from "reactstrap";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import Button from "~/components/UI/Button";
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

const BaseModal = (props: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useContentLocale();

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={cls(styles.modal, props.small && styles.small, props.className || "")}
      contentClassName={styles.modal_content}
      onOpened={props.onOpened}
    >
      <div className={styles.container} dir={isRTL ? undefined : "ltr"}>
        {props.help && (
          <div className={styles.sidebar}>
            <Image src={TutoImg} width={47} height={32} alt="" />
            <p className={styles.title}>{props.help.title}</p>
            <div className={styles.text}>
              {Array.isArray(props.help.content)
                ? props.help.content.map((p, i) => <p key={i}>{p}</p>)
                : props.help.content}
            </div>
          </div>
        )}
        <div className={styles.content}>
          {props.toggle && (
            <div className="text-end">
              <Button
                evaIcon="close-outline"
                iconPosition="right"
                priority="tertiary"
                className={styles.close}
                onClick={props.toggle}
              >
                {t("close")}
              </Button>
            </div>
          )}
          <p className={cls(styles.title, !props.toggle && "mt-4")}>{props.title}</p>
          {props.children}
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;
