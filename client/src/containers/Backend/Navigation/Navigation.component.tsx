import React from "react";
import styled from "styled-components";
import { navigationData } from "./data";
import { NavButton } from "./components/NavButton";
import { Props } from "./Navigation.container";

export type SelectedPage =
  | "notifications"
  | "favoris"
  | "profil"
  | "contributions"
  | "traductions"
  | "structure"
  | "admin"
  | "logout";
export interface PropsBeforeInjection {
  selected: SelectedPage;
}

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
`;

export const NavigationComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
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
            // @ts-ignore
            t={props.t}
          />
        );
      })}
    </NavigationContainer>
  );
};
