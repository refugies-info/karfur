import React from "react";
import { colors } from "../../../colors";
import styled from "styled-components";
import {
  illustration_connaitre_initiative,
  illustration_aidez_traduire,
} from "../../../assets/figma";
import { HomePageMobileSection } from "./HomePageMobileSection";

declare const window: Window;
interface Props {
  t: (text: string, defaultText: string) => void;
}

const MainContainer = styled.div`
  margin: 8px;
  position: relative;
  color=${colors.noir};
`;

export const HomePageMobile = (props: Props) => (
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
      onClick={() => {}}
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
    />
  </MainContainer>
);
