import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import * as React from "react";
import { ExplorerParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { TextNormal, TextNormalBold } from "../components/StyledText";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../services/redux/User/user.selectors";
import { contentsSelector } from "../services/redux/Contents/contents.selectors";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { theme } from "../theme";
import { needNameSelector } from "../services/redux/Needs/needs.selectors";
import { groupedContentsSelector } from "../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";

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
export const ContentsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "ContentsScreen">) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];
  const {
    tagName,
    tagDarkColor,
    tagVeryLightColor,
    tagLightColor,
    needId,
  } = route.params;

  const groupedContents = useSelector(groupedContentsSelector);
  const contentsId = groupedContents[needId];

  const filteredContents = contents.filter((content) => {
    const mainTag =
      content.tags && content.tags.length > 0 ? content.tags[0] : null;
    if (mainTag && mainTag.name === tagName) {
      return true;
    }
    return false;
  });

  const contentsToDisplay = contentsId.map((contentId) => {
    const contentWithInfosArray = contents.filter(
      (content) => content._id === contentId
    );
    if (contentWithInfosArray.length > 0) return contentWithInfosArray[0];
    return null;
  });

  const needName = useSelector(
    needNameSelector(needId, currentLanguageI18nCode)
  );

  return (
    <WrapperWithHeaderAndLanguageModal
      navigation={navigation}
      showSwitch={true}
    >
      <Header>
        {"Contents screen : tag " +
          tagName +
          " need :  " +
          needName +
          " " +
          contentsToDisplay.length +
          " fiches "}
      </Header>

      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        {contentsToDisplay.map((content, index) => {
          if (!content)
            return (
              <View>
                <TextNormalBold>Erreur</TextNormalBold>
              </View>
            );
          return (
            <ContentContainer
              key={index}
              onPress={() =>
                navigation.navigate("ContentScreen", {
                  contentId: content._id,
                  tagDarkColor,
                  tagVeryLightColor,
                  tagName,
                  tagLightColor,
                })
              }
            >
              <TextNormal>{content.titreInformatif}</TextNormal>
              {!!content.titreMarque && (
                <TextNormal>{" - " + content.titreMarque}</TextNormal>
              )}
            </ContentContainer>
          );
        })}
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
