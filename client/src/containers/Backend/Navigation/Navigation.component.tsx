/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import FButton from "../../../components/FigmaUI/FButton/FButton";
import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { navigationData } from "./data";
import { colors } from "../../../colors";
import { NavButton } from "./components/NavButton";

export type SelectedPage =
  | "notifications"
  | "favoris"
  | "profil"
  | "contributions"
  | "traductions"
  | "structure"
  | "admin"
  | "logout";
interface Props extends RouteComponentProps {
  selected: SelectedPage;
}

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
`;

const NavigationComponent: React.FunctionComponent<Props> = (props: Props) => {
  const onNavigateToTraductions = () => {
    props.history.push("/backend/user-translation");
  };
  return (
    <NavigationContainer>
      {navigationData.map((data) => {
        return (
          <NavButton
            title={data.title}
            key={data.type}
            iconName={data.iconName}
            isSelected={props.selected === data.type}
            type={data.type}
          />
        );
      })}
      {/* <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="bell-outline"
        >
          Mes notifications
        </FButton>
      </ButtonContainer>
      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="bookmark-outline"
        >
          Mes favoris
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="file-add-outline"
        >
          Mes fiches
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="play-circle-outline"
        >
          Mes traductions
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="briefcase-outline"
        >
          Ma structure
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="person-outline"
        >
          Mon profil
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="white"
          onClick={onNavigateToTraductions}
          name="shield-outline"
        >
          Admin
        </FButton>
      </ButtonContainer>

      <ButtonContainer>
        <FButton
          type="error"
          onClick={onNavigateToTraductions}
          name="log-out-outline"
        >
          Déconnexion
        </FButton>
      </ButtonContainer>
      */}
    </NavigationContainer>
  );
};

export const Navigation = withRouter(NavigationComponent);
