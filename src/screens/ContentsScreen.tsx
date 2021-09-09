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
import { needNameSelector } from "../services/redux/Needs/needs.selectors";

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

  const filteredContents = contents.filter((content) => {
    const mainTag =
      content.tags && content.tags.length > 0 ? content.tags[0] : null;
    if (mainTag && mainTag.name === tagName) {
      return true;
    }
    return false;
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
          filteredContents.length +
          " fiches plus test"}
      </Header>

      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        {filteredContents.map((content, index) => (
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
        ))}
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
