import React, { useState } from "react";
import { colors } from "../../../colors";
import styled from "styled-components";
import {
  illustration_connaitre_initiative,
  illustration_aidez_traduire,
  iphone,
} from "../../../assets/figma";
import { HomePageMobileSection } from "./HomePageMobileSection";
import { GoToDesktopModal } from "./GoToDesktopModal";
import { SubscribeNewsletterModal } from "../../Footer/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { ReceiveInvitationMailModal } from "./ReceiveInvitationMailModal";
import { HelpToTranslateMobileModal } from "./HelpToTranslateMobileModal";

declare const window: Window;
interface Props {
  t: (text: string, defaultText: string) => void;
}

const MainContainer = styled.div`
  position: relative;
  color=${colors.noir};
`;

export const HomePageMobile = (props: Props) => {
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
    <MainContainer>
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
        t={props.t}
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
        t={props.t}
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
        t={props.t}
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
        t={props.t}
      />
      <SubscribeNewsletterModal
        toggle={toggleShowNewsletterModal}
        show={showNewslettreModal}
        t={props.t}
      />
      <ReceiveInvitationMailModal
        toggle={toggleShowInvitationEmailModal}
        show={showInvitationEmailModal}
        togglePreviousModal={toggleGoToDesktopModal}
        t={props.t}
      />
      <HelpToTranslateMobileModal
        toggle={toggleShowHelpToTranslateModal}
        show={showHelpToTranslateModal}
      />
    </MainContainer>
  );
};
