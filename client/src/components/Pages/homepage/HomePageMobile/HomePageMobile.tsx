import React, { useState } from "react";
import { colors } from "colors";
import {
  illustration_connaitre_initiative,
  illustration_aidez_traduire,
  iphone,
} from "assets/figma";
import { HomePageMobileSection } from "./HomePageMobileSection";
import { GoToDesktopModal } from "./GoToDesktopModal";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { ReceiveInvitationMailModal } from "./ReceiveInvitationMailModal";
import { HelpToTranslateMobileModal } from "./HelpToTranslateMobileModal";

interface Props {
}

export const HomePageMobile = () => {
  const [showGoToDesktopModal, setShowGoToDesktopModal] = useState(false);
  const [showNewslettreModal, setShowNewsletterModal] = useState(false);
  const [showHelpToTranslateModal, setshowHelpToTranslateModal] =
    useState(false);
  const [showInvitationEmailModal, setShowInvitationEmailModal] =
    useState(false);

  const toggleGoToDesktopModal = () => {
    setShowGoToDesktopModal(!showGoToDesktopModal);
  };

  const toggleShowHelpToTranslateModal = () => {
    setshowHelpToTranslateModal(!showHelpToTranslateModal);
  };
  const toggleShowNewsletterModal = () => {
    setShowNewsletterModal(!showNewslettreModal);
  };
  const toggleShowInvitationEmailModal = () => {
    setShowInvitationEmailModal(!showInvitationEmailModal);
  };

  return (
    <div className="position-relative">
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
        backgroundColor={colors.blanc}
        textColor={colors.noir}
        isDisabled={false}
        onClick={toggleGoToDesktopModal}
        buttonColor={colors.noir}
        buttonTextColor={colors.blanc}
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
        textColor={colors.noir}
        isDisabled={false}
        onClick={toggleShowHelpToTranslateModal}
        buttonColor={colors.noir}
        buttonTextColor={colors.blanc}
      />

      <HomePageMobileSection
        image={iphone}
        title="Homepage.Bientôt dans votre smartphone"
        defaultTitle="Bientôt dans votre smartphone"
        text="Homepage.Une application mobile adaptée"
        defaultText="Une application mobile adaptée aux besoins des personnes réfugiées sera bientôt disponible."
        iconType="eva"
        iconName="email-outline"
        buttonTitle="Homepage.Je veux être informé"
        defaultBoutonTitle="Je veux être informé"
        backgroundColor={colors.bleuCharte}
        textColor={colors.blancSimple}
        isDisabled={false}
        onClick={toggleShowNewsletterModal}
        buttonColor={colors.blanc}
        buttonTextColor={colors.noir}
      />
      <GoToDesktopModal
        toggle={toggleGoToDesktopModal}
        show={showGoToDesktopModal}
        toggleShowInvitationEmailModal={toggleShowInvitationEmailModal}
      />
      <SubscribeNewsletterModal
        toggle={toggleShowNewsletterModal}
        show={showNewslettreModal}
      />
      <ReceiveInvitationMailModal
        toggle={toggleShowInvitationEmailModal}
        show={showInvitationEmailModal}
        togglePreviousModal={toggleGoToDesktopModal}
      />
      <HelpToTranslateMobileModal
        toggle={toggleShowHelpToTranslateModal}
        show={showHelpToTranslateModal}
      />
    </div>
  );
};
