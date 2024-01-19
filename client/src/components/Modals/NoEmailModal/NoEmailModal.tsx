import Image from "next/image";
import { useRouter } from "next/router";
import Button from "@codegouvfr/react-dsfr/Button";
import BaseModal from "components/UI/BaseModal";
import TutorielImage from "assets/dispositif/tutoriel-image.svg";

const NoEmailModal = () => {
  const router = useRouter();

  return (
    <BaseModal
      show={true}
      title={
        <>
          <i className="fr-icon-warning-line me-2" />
          Mettez votre profil à jour !
        </>
      }
      small
    >
      <p>
        Dans quelques semaines, vous ne pourrez plus vous connecter à votre compte Réfugiés.info sans adresse email.
      </p>
      <p>
        Vous avez jusqu’au <strong>6 février</strong> pour compléter votre profil. Passé cette date, nous supprimerons
        votre compte. Mais pas d’inquiétude, vous pourrez en créer un nouveau facilement.
      </p>
      <div className="text-center mb-8">
        <Image src={TutorielImage} width={176} height={120} alt="" />
      </div>
      <div className="text-end">
        <Button
          iconId="fr-icon-arrow-right-line"
          iconPosition="right"
          onClick={() => router.push("/backend/user-profile")}
        >
          Ajouter votre adresse email
        </Button>
      </div>
    </BaseModal>
  );
};

export default NoEmailModal;
