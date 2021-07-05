import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import * as React from "react";
import { ExplorerParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { TextNormal } from "../components/StyledText";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { contentsSelector } from "../services/redux/Contents/contents.selectors";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { theme } from "../theme";

const ContentContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.logement40};
  margin-horizontal: 16px;
  margin-vertical: 16px;
  padding: 16px;
`;
export const ContentsScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];
  return (
    <WrapperWithHeaderAndLanguageModal
      navigation={navigation}
      showSwitch={true}
    >
      <TextNormal>Contents screen</TextNormal>
      <ScrollView>
        {contents.map((content, index) => (
          <ContentContainer
            key={index}
            onPress={() =>
              navigation.navigate("ContentScreen", { contentId: content._id })
            }
          >
            <TextNormal>{content.titreInformatif}</TextNormal>
          </ContentContainer>
        ))}
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
