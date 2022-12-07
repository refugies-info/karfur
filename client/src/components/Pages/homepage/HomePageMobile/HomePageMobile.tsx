import React, { useState } from "react";
import { colors } from "colors";
import { illustration_connaitre_initiative, illustration_aidez_traduire } from "assets/figma";
import { HomePageMobileSection } from "./HomePageMobileSection";
import { GoToDesktopModal } from "./GoToDesktopModal";
import { ReceiveInvitationMailModal } from "./ReceiveInvitationMailModal";
import { HelpToTranslateMobileModal } from "./HelpToTranslateMobileModal";
import MobileAppSection from "../MobileAppSection";

export const HomePageMobile = () => {
  const [showGoToDesktopModal, setShowGoToDesktopModal] = useState(false);
  const [showHelpToTranslateModal, setshowHelpToTranslateModal] = useState(false);
  const [showInvitationEmailModal, setShowInvitationEmailModal] = useState(false);

  const toggleGoToDesktopModal = () => {
    setShowGoToDesktopModal(!showGoToDesktopModal);
  };

  const toggleShowHelpToTranslateModal = () => {
    setshowHelpToTranslateModal(!showHelpToTranslateModal);
  };
  const toggleShowInvitationEmailModal = () => {
    setShowInvitationEmailModal(!showInvitationEmailModal);
  };

  return (
    <div className="position-relative">
      <MobileAppSection />
      <HomePageMobileSection
        image={illustration_connaitre_initiative}
        title="Homepage.Faites connaître votre initiative"
        defaultTitle="Faites connaître votre initiative"
        text="Homepage.Participer à l'enrichissement du site"
        defaultText="Participer à l'enrichissement du site en rédigeant vous-même de nouvelles fiches, comme sur Wikipedia."
        iconName="monitor-outline"
        iconType="eva"
        buttonTitle="Homepage.Je propose une fiche"
        defaultBoutonTitle="Je propose une fiche"
        backgroundColor={colors.gray10}
        textColor={colors.gray90}
        isDisabled={false}
        onClick={toggleGoToDesktopModal}
        buttonColor={colors.gray90}
        buttonTextColor={colors.gray10}
      />
      <HomePageMobileSection
        image={illustration_aidez_traduire}
        title="Homepage.Aidez à traduire les informations"
        defaultTitle="Aidez à traduire les informations"
        text="Homepage.Contribuer à la traduction"
        defaultText="Contribuer à la traduction des contenus avec notre interface facile à utiliser. Rejoignez une équipe de traducteurs bénévoles et participez à votre rythme."
        iconName=""
        iconType="traduction"
        buttonTitle="Homepage.J'aide à traduire"
        defaultBoutonTitle="J'aide à traduire"
        backgroundColor={colors.lightGrey}
        textColor={colors.gray90}
        isDisabled={false}
        onClick={toggleShowHelpToTranslateModal}
        buttonColor={colors.gray90}
        buttonTextColor={colors.gray10}
      />
      <GoToDesktopModal
        toggle={toggleGoToDesktopModal}
        show={showGoToDesktopModal}
        toggleShowInvitationEmailModal={toggleShowInvitationEmailModal}
      />
      <ReceiveInvitationMailModal
        toggle={toggleShowInvitationEmailModal}
        show={showInvitationEmailModal}
        togglePreviousModal={toggleGoToDesktopModal}
      />
      <HelpToTranslateMobileModal toggle={toggleShowHelpToTranslateModal} show={showHelpToTranslateModal} />
    </div>
  );
};
