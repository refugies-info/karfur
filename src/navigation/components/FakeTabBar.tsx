import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import styled from "styled-components";
import { Columns, ColumnsSpacing } from "../../components";
import { styles } from "../../theme";
import { TabBarItem } from "./TabBarItem";

interface TabBarProps {
  width: number;
}

const FakeTabBarContainer = styled(View)<{ width: number }>`
  background-color: ${styles.colors.greyF7};
  width: ${({ width }) => width}px;
  padding: 1px;
`;

export const FakeTabBar = (props: TabBarProps) => {
  const { t } = useTranslation();
  return (
    <FakeTabBarContainer width={props.width}>
      <Columns spacing={ColumnsSpacing.NoSpace}>
        <TabBarItem
          isFocused={false}
          onPress={() => {}}
          options={{}}
          route={{ name: "Explorer" }}
          label={t("tab_bar.explorer", "Explorer")}
        />
        <TabBarItem
          isFocused={false}
          onPress={() => {}}
          options={{}}
          route={{ name: "Favoris" }}
          label={t("tab_bar.favorites", "Favoris")}
        />
        <TabBarItem
          isFocused={false}
          onPress={() => {}}
          options={{}}
          route={{ name: "Search" }}
          label={t("tab_bar.search", "Rechercher")}
        />
        <TabBarItem
          isFocused={false}
          onPress={() => {}}
          options={{}}
          route={{ name: "Profil" }}
          label={t("tab_bar.profile", "Moi")}
        />
      </Columns>
    </FakeTabBarContainer>
  );
};
