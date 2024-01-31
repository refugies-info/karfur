import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { RoleName } from "@refugies-info/api-types";
import Button from "@codegouvfr/react-dsfr/Button";
import { useRegisterFlow } from "hooks";
import { userDetailsSelector } from "services/User/user.selectors";
import { hasRole } from "lib/hasRole";
import BaseModal from "components/UI/BaseModal";

const NewProfileModal = () => {
  const [show, setShow] = useState(false);
  const userDetails = useSelector(userDetailsSelector);
  const { next } = useRegisterFlow(null);

  useEffect(() => {
    if (!userDetails) return;
    const missingUsername = !userDetails.username;
    const missingLanguage = hasRole(userDetails, RoleName.TRAD) && userDetails.selectedLanguages.length === 0;
    const missingPartner = hasRole(userDetails, RoleName.CAREGIVER) && !userDetails.partner;
    const missingDepartment = (userDetails.departments?.length || 0) === 0;

    const showNewProfileModal =
      !isMobileOnly &&
      (missingUsername || missingLanguage || missingPartner || missingDepartment) &&
      !window.location.pathname.includes("backend/user-profile");

    if (showNewProfileModal) setShow(true);
  }, [userDetails]);

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
