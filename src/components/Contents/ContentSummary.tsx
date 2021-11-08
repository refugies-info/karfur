import React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ObjectId } from "../../types/interface";
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
  ${(props: { noShadow: boolean }) => props.noShadow ? "" : `
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);`}
  elevation: 2;
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
  width: 56px;
  align-items: center;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
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
  tagDarkColor: string;
  tagVeryLightColor: string;
  tagName: string;
  tagLightColor: string;
  contentId: ObjectId;
  titreInfo?: string;
  titreMarque?: string | undefined;
  typeContenu: "dispositif" | "demarche";
  sponsorUrl: string | null;
  iconName: string;
  searchItem?: any;
  searchLanguageMatch?: string;
  isTextNotBold?: boolean;
  showAbstract?: boolean;
  noShadow?: boolean;
  style?: any;
  actionPress?: any;
  actionIcon?: string;
  backScreen?: string;
}
export const ContentSummary = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  const actionButton = (props.actionPress !== undefined) ?
    <ActionButton onPress={props.actionPress}>
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
        noShadow={!!props.noShadow}
        style={props.style || {}}
        onPress={() => {
          props.navigation.navigate("Explorer", {
            screen: "ContentScreen",
            params: {
              contentId: props.contentId,
              tagDarkColor: props.tagDarkColor,
              tagVeryLightColor: props.tagVeryLightColor,
              tagName: props.tagName,
              tagLightColor: props.tagLightColor,
              iconName: props.iconName,
              backScreen: props.backScreen
            }
          });
        }}
        activeOpacity={0.8}
      >
        <TitleContainer>
          {props.sponsorUrl ? (
            <ImageContainer isRTL={isRTL}>
              <Image
                source={{
                  uri: props.sponsorUrl,
                }}
                resizeMode={"contain"}
                style={{
                  height: 56,
                  width: 56,
                }}
              />
            </ImageContainer>
          ) : (
            <ImageContainer isRTL={isRTL}>
              <Image source={NoLogo} style={{ height: 58, width: 58 }} />
            </ImageContainer>
          )}
          <TitlesContainer isRTL={isRTL}>
            <TitreInfoText color={props.tagDarkColor} isDispo={true}>
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
              <TitreMarqueText color={props.tagDarkColor}>
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
          <DescInfoText color={props.tagDarkColor}>
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
      color={props.tagDarkColor}
      noShadow={!!props.noShadow}
      style={props.style || {}}
      onPress={() => {
        props.navigation.navigate("Explorer", {
          screen: "ContentScreen",
          params: {
            contentId: props.contentId,
            tagDarkColor: props.tagDarkColor,
            tagVeryLightColor: props.tagVeryLightColor,
            tagName: props.tagName,
            tagLightColor: props.tagLightColor,
            iconName: props.iconName,
            backScreen: props.backScreen
          }
        })
      }}
      activeOpacity={0.8}
    >
      <TitleContainer>
        <ImageContainer lightColor={props.tagVeryLightColor} isRTL={isRTL}>
          <DemarcheImage
            name={props.iconName}
            stroke={props.tagDarkColor}
            contentId={props.contentId}
          />
        </ImageContainer>

        <TitlesContainer isRTL={isRTL}>
          <TitreInfoText color={props.tagDarkColor}>
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
        <DescInfoText color={props.tagDarkColor}>
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
