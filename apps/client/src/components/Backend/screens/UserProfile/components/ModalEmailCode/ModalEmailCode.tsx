import CheckCode from "@/components/Pages/auth/CheckCode";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

interface Props {
  email: string;
  updateUser: (code: string) => Promise<void>;
  error: string | null;
}

export const modalEmailCode = createModal({
  id: "user-email-code-modal",
  isOpenedByDefault: false,
});

export const ModalEmailCode = ({ email, updateUser, error }: Props) => {
  return (
    <modalEmailCode.Component title="Entrez le code reçu">
      <CheckCode
        type="updateUser"
        email={email}
        updateUser={updateUser}
        error={error}
        notYouCallback={() => modalEmailCode.close()}
      />
    </modalEmailCode.Component>
  );
};
