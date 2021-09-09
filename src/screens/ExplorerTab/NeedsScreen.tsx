import * as React from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { TextNormal } from "../../components/StyledText";
import { ExplorerParamList } from "../../../types";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { contentsSelector } from "../../services/redux/Contents/contents.selectors";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { ScrollView } from "react-native";

const ContentContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.grey60};
  margin-horizontal: 16px;
  margin-vertical: 16px;
  padding: 16px;
`;

const Header = styled(TextNormal)`
  margin-left: 24px;
  margin-top: 8px;
`;
export const NeedsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];
  const {
    tagName,
    tagDarkColor,
    tagVeryLightColor,
    tagLightColor,
  } = route.params;

  return (
    <WrapperWithHeaderAndLanguageModal
      navigation={navigation}
      showSwitch={true}
    >
      <Header>{"needs screen : " + tagName + " "}</Header>

      <ScrollView></ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
