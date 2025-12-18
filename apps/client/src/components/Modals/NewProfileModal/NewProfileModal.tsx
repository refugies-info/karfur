import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
import { useCallback, useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useSelector } from "react-redux";
import BaseModal from "~/components/UI/BaseModal";
import FRLink from "~/components/UI/FRLink";
import { useRegisterFlow } from "~/hooks";
import { cls } from "~/lib/classname";
import { hasRole } from "~/lib/hasRole";
import { userSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";
import styles from "./NewProfileModal.module.scss";

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
      user.traducteur &&
      (userDetails.selectedLanguages.length === 0 || missingUsername || missingDepartment);
    const caregiverIncomplete = user.caregiver && (!userDetails.partner || missingDepartment);
    const contribIncomplete = user.contributeur && (missingUsername || missingDepartment);
    const userIncomplete = hasRole(userDetails, RoleName.USER) && missingDepartment;

    const showNewProfileModal =
      !isMobileOnly &&
      (tradIncomplete || caregiverIncomplete || contribIncomplete || userIncomplete) &&
      !window.location.pathname.includes("backend/user-profile");

    if (showNewProfileModal) setShow(true);
  }, [user]);

  const logout = useCallback(() => {
    API.logout();
    window.location.href = "/";
  }, []);

  const openCrisp = useCallback((e: any) => {
    e.preventDefault();
    window.$crisp.push(["do", "chat:open"]);
  }, []);

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
        Réfugiés.info améliore votre expérience de connexion pour vous proposer des contenus plus
        adaptés à vos besoins.
      </p>
      <p>
        Pour continuer à accéder au contenu, merci de{" "}
        <strong>compléter votre profil en cliquant sur le bouton ci-dessous</strong>.
      </p>
      <div className={cls("flex justify-between items-start", styles.actions)}>
        <Button priority="secondary" onClick={logout} className={styles.danger}>
          Me déconnecter
        </Button>

        <div className="flex flex-column items-end gap-2">
          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            onClick={() => next(null, true)}
          >
            Compléter votre profil
          </Button>

          <FRLink onClick={openCrisp} className={styles.link}>
            Je n'arrive pas à compléter mon profil
          </FRLink>
        </div>
      </div>
    </BaseModal>
  );
};

export default NewProfileModal;
