import React, { useState } from "react";
import { colors } from "../../../colors";
import styled from "styled-components";
import {
  illustration_connaitre_initiative,
  illustration_aidez_traduire,
  carte_france_web_mobile,
  iphone,
} from "../../../assets/figma";
import { HomePageMobileSection } from "./HomePageMobileSection";
import { GoToDesktopModal } from "./GoToDesktopModal";

declare const window: Window;
interface Props {
  t: (text: string, defaultText: string) => void;
}

const MainContainer = styled.div`
  margin: 8px;
  position: relative;
  color=${colors.noir};
`;

export const HomePageMobile = (props: Props) => {
  const [showGoToDesktopModal, setShowGoToDesktopModal] = useState(false);

  const toggleGoToDesktopModal = () => {
    setShowGoToDesktopModal(!showGoToDesktopModal);
  };

  return (
    <MainContainer>
      <HomePageMobileSection
        image={illustration_connaitre_initiative}
        title="Faites connaître votre initiative"
        defaultTitle="Faites connaître votre initiative"
        text="Participer à l'enrichissement du site"
        defaultText="Participer à l'enrichissement du site en rédigeant vous-même de nouvelles fiches, comme sur Wikipedia."
        iconName="monitor-outline"
        buttonTitle="Je propose une fiche"
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
        title="Aidez à traduire les informations"
        defaultTitle="Aidez à traduire les informations"
        text="Contribuer à la traduction "
        defaultText="Contribuer à la traduction des contenus avec notre interface facile à utiliser. Rejoignez une équipe de traducteurs bénévoles et participez à votre rythme."
        iconName="monitor-outline"
        buttonTitle="J'aide à traduire"
        defaultBoutonTitle="J'aide à traduire"
        t={props.t}
        backgroundColor={colors.lightGrey}
        textColor={colors.noir}
        isDisabled={false}
        onClick={() => {}}
        buttonColor={colors.noir}
        buttonTextColor={colors.blanc}
      />
      <HomePageMobileSection
        image={carte_france_web_mobile}
        title="Bientôt disponible près de chez vous"
        defaultTitle="Bientôt disponible près de chez vous"
        text="Réfugiés.info se déploie "
        defaultText="Réfugiés.info se déploie progressivement sur tout le territoire métropolitain. Deux départements sont déjà mobilisés à titre expérimental : la Côte d'Or (21) et l'Isère (38)."
        iconName="monitor-outline"
        buttonTitle="Je mobilise mon territoire"
        defaultBoutonTitle="Je mobilise mon territoire"
        t={props.t}
        backgroundColor={colors.blanc}
        textColor={colors.noir}
        isDisabled={false}
        onClick={() => {}}
        buttonColor={colors.noir}
        buttonTextColor={colors.blanc}
      />
      <HomePageMobileSection
        image={iphone}
        title="Bientôt dans votre smartphone"
        defaultTitle="Bientôt dans votre smartphone"
        text="Une application mobile adaptée "
        defaultText="Une application mobile adaptée aux besoins des personnes réfugiées sera bientôt disponible."
        iconName="email-outline"
        buttonTitle="Je veux être informé"
        defaultBoutonTitle="Je veux être informé"
        t={props.t}
        backgroundColor={colors.bleuCharte}
        textColor={colors.blancSimple}
        isDisabled={false}
        onClick={() => {}}
        buttonColor={colors.blanc}
        buttonTextColor={colors.noir}
      />
      <GoToDesktopModal
        toggle={toggleGoToDesktopModal}
        show={showGoToDesktopModal}
        t={props.t}
      />
    </MainContainer>
  );
};
