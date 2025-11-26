import Button from "@codegouvfr/react-dsfr/Button";
import { Id } from "@refugies-info/api-types";
import { Modal } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { RefObject, useCallback } from "react";
import { getPath } from "routes";
import { setLoginRedirect } from "~/lib/loginRedirect";
import { Event } from "~/lib/tracking";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispositifId?: Id;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const BookmarkedModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { open, onOpenChange, triggerRef } = props;

  const redirect = useCallback(() => {
    setLoginRedirect(props.dispositifId ? { addFavorite: props.dispositifId.toString() } : undefined);
    Event("AUTH", "start", "bookmark");
    router.push(getPath("/auth", "fr"));
  }, [props.dispositifId, router]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      title={t("UserFavorites.login_modal_title")}
      description={t("UserFavorites.login_modal_text")}
      maxWidth="sm"
    >
      <Button
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
        className="w-full justify-center"
        onClick={redirect}
      >
        {t("login_or_signup")}
      </Button>
    </Modal>
  );
};

export default BookmarkedModal;
