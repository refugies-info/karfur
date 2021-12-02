import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ThemeTag, ObjectId } from "../../types/interface";
import { TextSmallBold, TextSmallNormal, TextVerySmallNormal } from "../StyledText";
import { RTLView } from "../BasicComponents";
import { Image } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import NoLogo from "../../theme/images/contents/structure_no_logo.png";
import { DemarcheImage } from "./DemarcheImage";
import Highlight from "../Search/Highlight";

const ContentContainer = styled.TouchableOpacity`
  background-color: ${(props: { isDispo: boolean }) => (props.isDispo ?
    theme.colors.white : theme.colors.lightGrey)};
  min-height: ${(props: { isDispo: boolean }) => (props.isDispo ? 80 : 72)}px;
  border-radius: ${theme.radius * 2}px;
  ${theme.shadows.sm}
  border-width: ${(props: { isDispo: boolean }) => (!props.isDispo ? 2 : 0)}px;
  border-color: ${(props: { color: string }) => props.color || "transparent"};
  border-style: solid;
`;

const TitleContainer = styled(RTLView)`
  align-items: center;
  flex: 1;
`;

const ImageContainer = styled.View`
  justify-content: center;
  width: 64px;
  height: 64px;
  align-items: center;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
  border-width: 6px;
  border-color: ${(props: { hasMatch: boolean }) =>
    props.hasMatch ? theme.colors.lightBlue : "transparent"};
  border-radius: ${theme.radius * 2}px;
`;

const TitreInfoText = styled(TextSmallBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${(props: { isDispo: boolean }) =>
    props.isDispo ? theme.margin : 0}px;
  flex-shrink: 1;
`;

const DescInfoText = styled(TextSmallNormal)`
  color: ${(props: { color: string }) => props.color};
  margin: ${theme.margin * 2}px;
`;

const TitreMarqueText = styled(TextVerySmallNormal)`
  color: ${(props: { color: string }) => props.color};
  flex-shrink: 1;
`;

const TitlesContainer = styled.View`
  display: flex;
  flex: 1;
  align-items: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  padding: 16px;
`;

const ActionButton = styled.TouchableOpacity`
  padding-horizontal: ${theme.margin * 2}px;
  height: 100%;
  justify-content: center;
`;

interface Props {
  navigation: any;
  contentId: ObjectId;
  themeTag: ThemeTag;
  titreInfo?: string;
  titreMarque?: string | undefined;
  typeContenu: "dispositif" | "demarche";
  sponsorUrl: string | null;
  searchItem?: any;
  searchLanguageMatch?: string;
  isTextNotBold?: boolean;
  showAbstract?: boolean;
  style?: StyleProp<ViewStyle>;
  actionPress?: any;
  actionIcon?: string;
  actionLabel?: string;
  backScreen?: string;
  hasSponsorMatch?: boolean;
}
export const ContentSummary = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  const actionButton = (props.actionPress !== undefined) ?
    <ActionButton
      onPress={props.actionPress}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={props.actionLabel}
    >
      <Icon
        name={props.actionIcon || ""}
        width={16}
        height={16}
        fill={theme.colors.black}
      />
    </ActionButton>
    : null;

  if (props.typeContenu === "dispositif") {
    return (
      <ContentContainer
        isDispo={true}
        style={props.style || {}}
        activeOpacity={0.8}
        accessibilityRole="button"
        onPress={() => {
          props.navigation.navigate("Explorer", {
            screen: "ContentScreen",
            params: {
              contentId: props.contentId,
              colors: props.themeTag,
              backScreen: props.backScreen
            }
          });
        }}
      >
        <TitleContainer>
          {props.sponsorUrl ? (
            <ImageContainer isRTL={isRTL} hasMatch={props.hasSponsorMatch}>
              <Image
                source={{ uri: props.sponsorUrl }}
                resizeMode={"contain"}
                style={{ height: 58, width: 58, maxWidth: "100%" }}
              />
            </ImageContainer>
          ) : (
            <ImageContainer isRTL={isRTL} hasMatch={props.hasSponsorMatch}>
              <Image source={NoLogo} style={{ height: 58, width: 58 }} />
            </ImageContainer>
          )}

          <TitlesContainer isRTL={isRTL}>
            <TitreInfoText color={props.themeTag.tagDarkColor} isDispo={true}>
              {props.searchItem ?
                <Highlight
                  hit={props.searchItem}
                  attribute={`title_${props.searchLanguageMatch||"fr"}`}
                  //@ts-ignore
                  color={props.tagDarkColor}
                /> :
                props.titreInfo
              }
            </TitreInfoText>
            {(!!props.titreMarque || !!props?.searchItem[`titreMarque_${props.searchLanguageMatch||"fr"}`]) && (
              <TitreMarqueText color={props.themeTag.tagDarkColor}>
                 {props.searchItem ?
                    <Highlight
                      hit={props.searchItem}
                      attribute={`titreMarque_${props.searchLanguageMatch||"fr"}`}
                      //@ts-ignore
                      color={props.tagDarkColor}
                    /> :
                    props.titreMarque
                  }
              </TitreMarqueText>
            )}
          </TitlesContainer>
          {actionButton}
        </TitleContainer>

        {props.showAbstract &&
          <DescInfoText color={props.themeTag.tagDarkColor}>
            <Highlight
              hit={props.searchItem}
              attribute={`abstract_${props.searchLanguageMatch||"fr"}`}
              //@ts-ignore
              color={props.tagDarkColor}
            />
          </DescInfoText>
        }

      </ContentContainer>
    );
  }
  return (
    <ContentContainer
      isDispo={false}
      color={props.themeTag.tagDarkColor}
      style={props.style || {}}
      activeOpacity={0.8}
      accessibilityRole="button"
      onPress={() => {
        props.navigation.navigate("Explorer", {
          screen: "ContentScreen",
          params: {
            contentId: props.contentId,
            colors: props.themeTag,
            backScreen: props.backScreen
          }
        })
      }}
    >
      <TitleContainer>
        <ImageContainer lightColor={props.themeTag.tagVeryLightColor} isRTL={isRTL}>
          <DemarcheImage
            name={props.themeTag.iconName}
            stroke={props.themeTag.tagDarkColor}
            contentId={props.contentId}
          />
        </ImageContainer>

        <TitlesContainer isRTL={isRTL}>
          <TitreInfoText color={props.themeTag.tagDarkColor}>
            {props.searchItem ?
              <Highlight
                hit={props.searchItem}
                attribute={`title_${props.searchLanguageMatch||"fr"}`}
                //@ts-ignore
                color={props.tagDarkColor}
              /> :
              props.titreInfo
            }
          </TitreInfoText>
        </TitlesContainer>
        {actionButton}
      </TitleContainer>

      {props.showAbstract &&
        <DescInfoText color={props.themeTag.tagDarkColor}>
          <Highlight
            hit={props.searchItem}
            attribute={`abstract_${props.searchLanguageMatch||"fr"}`}
            //@ts-ignore
            color={props.tagDarkColor}
          />
        </DescInfoText>
      }

    </ContentContainer>
  );
};
