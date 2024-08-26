import BaseModal from "@/components/UI/BaseModal";
import { useRegisterFlow } from "@/hooks";
import { hasRole } from "@/lib/hasRole";
import { userSelector } from "@/services/User/user.selectors";
import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
import { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useSelector } from "react-redux";

const NewProfileModal = () => {
  const [show, setShow] = useState(false);
  const user = useSelector(userSelector);
  const { next } = useRegisterFlow(null);

  useEffect(() => {
    const userDetails = user.user;
    if (!userDetails) return;
    const missingUsername = !userDetails.username;
    const missingDepartment = (userDetails.departments?.length || 0) === 0;

    const tradIncomplete =
      user.traducteur && (userDetails.selectedLanguages.length === 0 || missingUsername || missingDepartment);
    const caregiverIncomplete = user.caregiver && (!userDetails.partner || missingDepartment);
    const contribIncomplete = user.contributeur && (missingUsername || missingDepartment);
    const userIncomplete = hasRole(userDetails, RoleName.USER) && missingDepartment;

    const showNewProfileModal =
      !isMobileOnly &&
      (tradIncomplete || caregiverIncomplete || contribIncomplete || userIncomplete) &&
      !window.location.pathname.includes("backend/user-profile");

    if (showNewProfileModal) setShow(true);
  }, [user]);

  return (
    <BaseModal
      show={show}
      title={
        <>
          <i className="fr-icon-warning-line me-2" />
          Votre compte Réfugiés.info fait peau neuve&nbsp;!
        </>
      }
      small
    >
      <p>
        Réfugiés.info améliore votre expérience de connexion pour vous proposer des contenus plus adaptés à vos besoins.
      </p>
      <p>
        Pour continuer à accéder au contenu, merci de{" "}
        <strong>compléter votre profil en cliquant sur le bouton ci-dessous</strong>.
      </p>
      <div className="text-end">
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right" onClick={() => next(null, true)}>
          Compléter votre profil
        </Button>
      </div>
    </BaseModal>
  );
};

export default NewProfileModal;
