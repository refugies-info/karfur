import { useAsyncFn } from "react-use";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Button from "@codegouvfr/react-dsfr/Button";
import API from "utils/API";
import ErrorMessage from "components/UI/ErrorMessage";
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
      title="Êtes-vous sûr ?"
      buttons={[
        {
          onClick: () => modalDeleteAccount.close(),
          children: "Annuler",
          priority: "secondary",
          disabled: loading,
        },
        {
          children: "Oui, le supprimer",
          onClick: onValidate,
          priority: "primary",
          iconId: "fr-icon-delete-bin-line",
          className: styles.danger,
          disabled: loading,
        },
      ]}
    >
      <p className="mb-8">Souhaitez-vous supprimer votre compte&nbsp;? Cette action est irréversible.</p>
      <ErrorMessage error={error?.message} />
    </modalDeleteAccount.Component>
  );
};
