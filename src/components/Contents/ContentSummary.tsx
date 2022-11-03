import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { ObjectId, Theme } from "../../types/interface";
import {
  TextSmallBold,
  TextSmallNormal,
  TextVerySmallNormal,
} from "../StyledText";
import { RTLView } from "../BasicComponents";
import { Image } from "react-native";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import NoLogo from "../../theme/images/contents/structure_no_logo.png";
import { DemarcheImage } from "./DemarcheImage";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import Highlight from "../Search/Highlight";
import { ReadableText } from "../ReadableText";
import { defaultColors } from "../../libs/getThemeTag";

const IMAGE_SIZE = 58;

const ContentContainer = styled.TouchableOpacity<{
  isDispo: boolean;
  color?: string;
}>`
  background-color: ${({ isDispo, theme }) =>
    isDispo ? theme.colors.white : theme.colors.lightGrey};
  min-height: ${({ isDispo }) => (isDispo ? 80 : 72)}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.lg}
  border-width: ${({ isDispo }) => (!isDispo ? 2 : 0)}px;
  border-color: ${({ color }) => color || "transparent"};
  border-style: solid;
`;

const TitleContainer = styled(RTLView)`
  align-items: center;
  flex: 1;
`;

const ImageContainer = styled.View<{ hasMatch?: boolean; lightColor?: string }>`
  justify-content: center;
  width: 64px;
  height: 64px;
  align-items: center;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin * 2)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
  border-width: 6px;
  border-color: ${({ hasMatch, theme }) =>
    hasMatch ? theme.colors.lightBlue : "transparent"};
  border-radius: ${({ theme }) => theme.radius * 2}px;
`;

const TitreInfoText = styled(TextSmallBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${(props: { isDispo: boolean }) =>
    props.isDispo ? styles.margin : 0}px;
  flex-shrink: 1;
`;

const DescInfoText = styled(TextSmallNormal)`
  color: ${(props: { color: string }) => props.color};
  margin: ${styles.margin * 2}px;
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
  padding-horizontal: ${styles.margin * 2}px;
  height: 100%;
  justify-content: center;
`;

interface Props {
  navigation: any;
  contentId: ObjectId;
  needId?: ObjectId;
  theme?: Theme | null;
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

  const logEventOnClick = (id: string) => {
    logEventInFirebase(FirebaseEvent.CLIC_CONTENT, {
      contentId: id,
    });
  };

  const colors = props.theme?.colors || defaultColors;

  const actionButton =
    props.actionPress !== undefined ? (
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
          fill={styles.colors.black}
        />
      </ActionButton>
    ) : null;

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
              needId: props.needId,
              theme: props.theme,
              backScreen: props.backScreen,
            },
          });
          logEventOnClick(props.contentId);
        }}
      >
        <TitleContainer>
          {props.sponsorUrl ? (
            <ImageContainer hasMatch={props.hasSponsorMatch}>
              <Image
                source={{ uri: props.sponsorUrl }}
                resizeMode={"contain"}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                  maxWidth: "100%",
                }}
              />
            </ImageContainer>
          ) : (
            <ImageContainer hasMatch={props.hasSponsorMatch}>
              <Image
                source={NoLogo}
                style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
              />
            </ImageContainer>
          )}

          <TitlesContainer isRTL={isRTL}>
            <TitreInfoText color={colors.color100} isDispo={true}>
              {props.searchItem ? (
                <Highlight
                  hit={props.searchItem}
                  attribute={`title_${props.searchLanguageMatch || "fr"}`}
                  //@ts-ignore
                  color={colors.color100}
                />
              ) : (
                <ReadableText>{props.titreInfo || ""}</ReadableText>
              )}
            </TitreInfoText>
            {(!!props.titreMarque ||
              !!props?.searchItem[
                `titreMarque_${props.searchLanguageMatch || "fr"}`
              ]) && (
              <TitreMarqueText color={colors.color100}>
                {props.searchItem ? (
                  <Highlight
                    hit={props.searchItem}
                    attribute={`titreMarque_${
                      props.searchLanguageMatch || "fr"
                    }`}
                    //@ts-ignore
                    color={colors.color100}
                  />
                ) : (
                  <ReadableText>{props.titreMarque || ""}</ReadableText>
                )}
              </TitreMarqueText>
            )}
          </TitlesContainer>
          {actionButton}
        </TitleContainer>

        {props.showAbstract && (
          <DescInfoText color={colors.color100}>
            <Highlight
              hit={props.searchItem}
              attribute={`abstract_${props.searchLanguageMatch || "fr"}`}
              //@ts-ignore
              color={colors.color100}
            />
          </DescInfoText>
        )}
      </ContentContainer>
    );
  }
  return (
    <ContentContainer
      isDispo={false}
      color={colors.color100}
      style={props.style || {}}
      activeOpacity={0.8}
      accessibilityRole="button"
      onPress={() => {
        props.navigation.navigate("Explorer", {
          screen: "ContentScreen",
          params: {
            contentId: props.contentId,
            needId: props.needId,
            theme: props.theme,
            backScreen: props.backScreen,
          },
        });
        logEventOnClick(props.contentId);
      }}
    >
      <TitleContainer>
        <ImageContainer lightColor={colors.color30}>
          <DemarcheImage
            icon={props.theme?.icon}
            stroke={colors.color100}
            contentId={props.contentId}
            isSmall={true}
          />
        </ImageContainer>

        <TitlesContainer isRTL={isRTL}>
          <TitreInfoText color={colors.color100}>
            {props.searchItem ? (
              <Highlight
                hit={props.searchItem}
                attribute={`title_${props.searchLanguageMatch || "fr"}`}
                //@ts-ignore
                color={colors.color100}
              />
            ) : (
              <ReadableText>{props.titreInfo}</ReadableText>
            )}
          </TitreInfoText>
        </TitlesContainer>
        {actionButton}
      </TitleContainer>

      {props.showAbstract && (
        <DescInfoText color={colors.color100}>
          <Highlight
            hit={props.searchItem}
            attribute={`abstract_${props.searchLanguageMatch || "fr"}`}
            //@ts-ignore
            color={colors.color100}
          />
        </DescInfoText>
      )}
    </ContentContainer>
  );
};
