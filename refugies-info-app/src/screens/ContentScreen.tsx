import * as React from "react";
import styled from "styled-components/native";
import { View, Text, I18nManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "../components/HeaderWithBack";
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

const TextContainer = styled.View`
  padding: 24px;
`;
export const ContentScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();

  const dispatch = useDispatch();

  React.useEffect(() => {
    const id = "606eb3baf1ab0700152063ba";

    dispatch(fetchSelectedContentActionCreator(id));
  }, []);
  const selectedContent = useSelector(selectedContentSelector);

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

      <TouchableOpacity onPress={() => I18nManager.forceRTL(false)}>
        <Text>test</Text>
      </TouchableOpacity>

      <ScrollView>
        <TextContainer>
          <TextNormal>{selectedContent.titreInformatif}</TextNormal>
          <Text>{part1}</Text>
          <HTML
            source={{ html: part1 }}
            classesStyles={{
              "bloc-rouge": {
                backgroundColor: theme.colors.lightRed,
                borderRadius: 12,
                padding: 20,
                display: "flex",
                marginBottom: 10,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
              "icon-left-side": {
                paddingRight: isRTL ? 0 : 20,
                paddingLeft: isRTL ? 20 : 0,
              },
            }}
            tagsStyles={{
              strong: {
                fontFamily: theme.fonts.families.circularBold,
              },
              b: {
                fontFamily: theme.fonts.families.circularBold,
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
              ul: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                <View style={{ display: "flex", flexDirection: "column" }}>
                  {/* <Icon
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    height={18}
                    width={18}
                    fill={theme.colors.black}
                  /> */}
                  {children}
                </View>
              ),

              // eslint-disable-next-line react/display-name
              li: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                <RTLView style={{ marginBottom: 8 }}>
                  <Icon
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    height={18}
                    width={18}
                    fill={theme.colors.black}
                  />
                  {children}
                </RTLView>
              ),
              p: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                <TextNormal>{children}</TextNormal>
              ),
            }}
          />
        </TextContainer>
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
