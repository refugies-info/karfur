import ErrorMessage from "@/components/UI/ErrorMessage";
import API from "@/utils/API";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useAsyncFn } from "react-use";
import styles from "./ModalDeleteAccount.module.scss";

interface Props {}

export const modalDeleteAccount = createModal({
  id: "delete-account-modal",
  isOpenedByDefault: false,
});

export const ModalDeleteAccount = (props: Props) => {
  const [{ loading, error }, onValidate] = useAsyncFn(async () => {
    await API.deleteMyAccount();
    API.logout();
    window.location.href = "/";
  }, []);

  return (
    <modalDeleteAccount.Component
      title="Êtes-vous sûrs de vouloir supprimer votre compte ?"
      buttons={[
        {
          onClick: () => modalDeleteAccount.close(),
          children: "Annuler",
          priority: "secondary",
          disabled: loading,
        },
        {
          children: "Supprimer mon compte",
          onClick: onValidate,
          priority: "primary",
          iconId: "fr-icon-delete-bin-line",
          className: styles.danger,
          disabled: loading,
        },
      ]}
    >
      <p className="mb-8">
        Vous perdrez l'accès à vos favoris ainsi qu'à votre structure et aux fiches que vous avez rédigées.
      </p>
      <ErrorMessage error={error?.message} />
    </modalDeleteAccount.Component>
  );
};
