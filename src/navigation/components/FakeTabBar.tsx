
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import styled from "styled-components";
import { theme } from "../../theme";
import { TabBarItem } from "./TabBarItem";

interface TabBarProps {
  width: number
}
const FakeTabBarContainer = styled(View)`
  background-color: ${theme.colors.greyF7};
  height: 40px;
  width: ${(props: {width: number}) => props.width}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${theme.radius * 2}px;
`;
export const FakeTabBar = (props: TabBarProps) => {
  const { t } = useTranslation();

  return (
    <FakeTabBarContainer width={props.width}>
      <TabBarItem
        isFocused={false}
         onPress={() => {}}
         options={{}}
         route={{name: "Explorer"}}
         label={t("tab_bar.explorer", "Explorer")}
      />
      <TabBarItem
        isFocused={false}
         onPress={() => {}}
         options={{}}
         route={{name: "Favoris"}}
         label={t("tab_bar.favorites", "Favoris")}
      />
      <TabBarItem
        isFocused={false}
         onPress={() => {}}
         options={{}}
         route={{name: "Search"}}
         label={t("tab_bar.search", "Rechercher")}
      />
      <TabBarItem
        isFocused={false}
         onPress={() => {}}
         options={{}}
         route={{name: "Profil"}}
         label={t("tab_bar.profile", "Moi")}
      />
    </FakeTabBarContainer>
  )
}