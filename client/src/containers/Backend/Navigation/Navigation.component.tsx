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
            onClick={onNavigateToTraductions}
          />
        );
      })}
    </NavigationContainer>
  );
};

export const Navigation = withRouter(NavigationComponent);
