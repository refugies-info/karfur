import React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ObjectId } from "../../types/interface";
import { TextNormalBold, TextSmallNormal } from "../StyledText";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { Image, View } from "react-native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import NoLogo from "../../theme/images/contents/structure_no_logo.png";

const ContentContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.margin * 3}px;
  padding: ${theme.margin * 2}px;
  min-height: ${(props: { isDispo: boolean }) => (props.isDispo ? 80 : 72)}px;
  border-radius: ${theme.radius * 2}px;
  box-shadow: 0px 8px 16px rgba(33, 33, 33, 0.24);
  elevation: 2;
  display: flex;
`;

const StructureImageContainer = styled.View`
  justify-content: center;
  width: 65px;
  align-items: center;
`;

const TitreInfoText = styled(TextNormalBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${theme.margin}px;
  flex-shrink: 1;
`;

const TitreMarqueText = styled(TextSmallNormal)`
  color: ${(props: { color: string }) => props.color};
  flex-shrink: 1;
`;

const TitlesContainer = styled.View`
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : 20)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? 20 : 0)}px;

  display: flex;
  flex: 1;
  align-items: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
`;

interface Props {
  navigation: any;
  tagDarkColor: string;
  tagVeryLightColor: string;
  tagName: string;
  tagLightColor: string;
  contentId: ObjectId;
  titreInfo: string;
  titreMarque: string | undefined;
  typeContenu: "dispositif" | "demarche";
  sponsorUrl: string | null;
}
export const ContentSummary = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  if (props.typeContenu === "dispositif") {
    return (
      <ContentContainer
        onPress={() =>
          props.navigation.navigate("ContentScreen", {
            contentId: props.contentId,
            tagDarkColor: props.tagDarkColor,
            tagVeryLightColor: props.tagVeryLightColor,
            tagName: props.tagName,
            tagLightColor: props.tagLightColor,
          })
        }
        isDispo={props.typeContenu === "dispositif"}
      >
        {props.sponsorUrl ? (
          <StructureImageContainer>
            <Image
              source={{
                uri: props.sponsorUrl,
              }}
              resizeMode={"contain"}
              style={{
                height: 65,
                width: 65,
              }}
            />
          </StructureImageContainer>
        ) : (
          <StructureImageContainer>
            <Image source={NoLogo} style={{ height: 48, width: 48 }} />
          </StructureImageContainer>
        )}
        <TitlesContainer isRTL={isRTL}>
          <TitreInfoText color={props.tagDarkColor}>
            {props.titreInfo}
          </TitreInfoText>
          {!!props.titreMarque && (
            <RTLView style={{ marginLeft: 4, alignItems: "flex-start" }}>
              <TitreMarqueText color={props.tagDarkColor}>
                {t("ContentsScreen.avec", "avec") + " " + props.titreMarque}
              </TitreMarqueText>

              {/* <TitreMarqueText
                color={props.tagDarkColor}
                style={{
                  marginLeft: isRTL ? 4 : 0,
                  marginRight: isRTL ? 0 : 4,
                  alignItems: "flex-start",
                }}
              >
                {t("ContentsScreen.avec", "avec")}
              </TitreMarqueText>
              <TitreMarqueText color={props.tagDarkColor}>
                {props.titreMarque}
              </TitreMarqueText> */}
            </RTLView>
          )}
        </TitlesContainer>
      </ContentContainer>
    );
  }
  return <View />;
};
