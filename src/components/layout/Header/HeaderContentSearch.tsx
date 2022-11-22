import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { HeaderContentProps } from "./HeaderContentProps";

const FakeInput = styled(RTLTouchableOpacity)`
  min-height:48px;
  width 100%;
  border-radius:${({ theme }) => theme.radius * 2}px;
  padding:${({ theme }) => theme.margin * 2}px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.darkGrey};
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FakeInputText = styled.Text`
  color: ${({ theme }) => theme.colors.darkGrey};
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
`;

export interface HeaderContentSearchProps extends HeaderContentProps {}

const HeaderContentSearch = ({
  showSimplifiedHeader,
}: HeaderContentSearchProps) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const navigation = useNavigation<any>();
  return (
    <View
      style={{
        ...(showSimplifiedHeader
          ? {
              marginTop: -64,
              // top: theme.insets.top,
              // left: theme.margin * 3,
              width: "65%",
            }
          : {}),
      }}
    >
      <FakeInput
        onPress={() => navigation.navigate("SearchResultsScreen")}
        accessibilityRole="button"
      >
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={theme.colors.darkGrey}
        />
        <FakeInputText>{t("search_screen.search", "Rechercher")}</FakeInputText>
      </FakeInput>
    </View>
  );
};

export default HeaderContentSearch;
