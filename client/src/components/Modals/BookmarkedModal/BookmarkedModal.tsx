import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Id } from "@refugies-info/api-types";
import Button from "@codegouvfr/react-dsfr/Button";
import { getPath } from "routes";
import { setLoginRedirect } from "lib/loginRedirect";
import BaseModal from "components/UI/BaseModal";
import styles from "./BookmarkedModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifId?: Id;
}

const BookmarkedModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { show, toggle } = props;

  const redirect = useCallback(() => {
    setLoginRedirect(props.dispositifId ? { addFavorite: props.dispositifId.toString() } : undefined);
    router.push(getPath("/auth", "fr"));
  }, [props.dispositifId, router]);

  return (
    <BaseModal show={show} toggle={toggle} title={t("UserFavorites.login_modal_title")} className={styles.modal}>
      <p>{t("UserFavorites.login_modal_text")}</p>
      <Button iconId="fr-icon-arrow-right-line" iconPosition="right" className={styles.button} onClick={redirect}>
        {t("login_or_signup")}
      </Button>
    </BaseModal>
  );
};

export default BookmarkedModal;
