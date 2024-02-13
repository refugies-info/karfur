import { useCallback, useState } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { ForgotPassword, ForgotPasswordMailSent } from "components/User";

interface Props {
  email: string;
}

export const modalResetPassword = createModal({
  id: "user-password-modal",
  isOpenedByDefault: false,
});

export const ModalResetPassword = ({ email }: Props) => {
  const [sent, setSent] = useState(false);

  const successCallback = useCallback(() => {
    setSent(true);
  }, []);

  return (
    <modalResetPassword.Component title={!sent ? "Mot de passe oublié" : "Un lien a été envoyé"}>
      {!sent ? (
        <>
          <p>Nous allons vous envoyer un mail avec des instructions pour le réinitialiser.</p>
          <ForgotPassword email={email} successCallback={successCallback} />
        </>
      ) : (
        <>
          <p>
            Nous venons de vous envoyer un mail pour réinitialiser votre mot de passe à l’adresse suivante&nbsp;:{" "}
            {email}.
            <br />
            <br />
            Si vous ne recevez pas de mail d’ici quelques minutes, pensez à vérifier vos courriers indésirables ou vos
            spams.
          </p>
          <ForgotPasswordMailSent email={email} />
        </>
      )}
    </modalResetPassword.Component>
  );
};
