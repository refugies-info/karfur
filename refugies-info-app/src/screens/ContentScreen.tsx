import * as React from "react";
import styled from "styled-components/native";
import { View, Text, useWindowDimensions } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedContentActionCreator } from "../services/redux/SelectedContent/selectedContent.actions";
import { selectedContentSelector } from "../services/redux/SelectedContent/selectedContent.selectors";
import HTML from "react-native-render-html";
import { theme } from "../theme";
import { TextNormal } from "../components/StyledText";
import { RTLView } from "../components/BasicComponents";
import { Icon } from "react-native-eva-icons";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
} from "../services/redux/User/user.selectors";

const TextContainer = styled.View`
  padding: 24px;
`;
export const ContentScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();

  const dispatch = useDispatch();

  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const currentLanguage = useSelector(currentI18nCodeSelector);

  React.useEffect(() => {
    // const id = "606eb3baf1ab0700152063ba";
    const id = "5dd55ea09c2d3400163bc00a";
    if (id && selectedLanguage) {
      dispatch(
        fetchSelectedContentActionCreator({
          contentId: id,
          locale: selectedLanguage,
        })
      );
    }
  }, [selectedLanguage]);

  const selectedContent = useSelector(selectedContentSelector(currentLanguage));

  const contentWidth = useWindowDimensions().width;
  if (!selectedContent) {
    return (
      <WrapperWithHeaderAndLanguageModal>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text>Back</Text>
        </TouchableOpacity>

        <TextContainer>
          <Text>pas de contenu</Text>
        </TextContainer>
      </WrapperWithHeaderAndLanguageModal>
    );
  }

  const part1 = selectedContent.contenu[0].content;

  return (
    <WrapperWithHeaderAndLanguageModal>
      <TouchableOpacity onPress={navigation.goBack}>
        <Text>Back</Text>
      </TouchableOpacity>

      <ScrollView>
        <TextContainer>
          <TextNormal>{selectedContent.titreInformatif}</TextNormal>
          <Text>{part1}</Text>
          <HTML
            contentWidth={contentWidth}
            source={{ html: part1 }}
            classesStyles={{
              "bloc-rouge": {
                backgroundColor: theme.colors.lightRed,
                borderRadius: 12,
                padding: 20,
                display: "flex",
                marginBottom: 10,
                flexDirection: isRTL ? "row-reverse" : "row",
                textAlign: isRTL ? "right" : "left",
                marginTop: 10,
              },
              "icon-left-side": {
                paddingRight: isRTL ? 0 : 20,
                paddingLeft: isRTL ? 20 : 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
              "right-side": {
                color: theme.colors.black,
                textAlign: isRTL ? "right" : "left",
              },
            }}
            tagsStyles={{
              strong: {
                fontFamily: theme.fonts.families.circularBold,
              },
              b: {
                fontFamily: theme.fonts.families.circularBold,
                textAlign: isRTL ? "right" : "left",
              },
            }}
            baseFontStyle={{
              fontSize: 19,
              fontFamily: theme.fonts.families.circularStandard,
              textAlign: isRTL ? "right" : "left",
              lineHeight: 24,
            }}
            renderers={{
              // eslint-disable-next-line react/display-name
              ul: (_, children) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {children}
                </View>
              ),
              // eslint-disable-next-line react/display-name
              li: (_, children) => (
                <RTLView style={{ marginBottom: 8 }}>
                  <View
                    style={{
                      marginLeft: isRTL ? 8 : 0,
                      marginRight: isRTL ? 0 : 8,
                    }}
                  >
                    <Icon
                      name={isRTL ? "arrow-left" : "arrow-right"}
                      height={18}
                      width={18}
                      fill={theme.colors.black}
                    />
                  </View>
                  <TextNormal>{children}</TextNormal>
                </RTLView>
              ),
              // eslint-disable-next-line react/display-name
              p: (_, children) => (
                <TextNormal style={{ marginBottom: 8, marginTop: 8 }}>
                  {children}
                </TextNormal>
              ),
            }}
          />
        </TextContainer>
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
