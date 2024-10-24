import Button from "@codegouvfr/react-dsfr/Button";
import { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { getPath } from "routes";
import BaseModal from "~/components/UI/BaseModal";
import { setLoginRedirect } from "~/lib/loginRedirect";
import { Event } from "~/lib/tracking";
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
    Event("AUTH", "start", "bookmark");
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
