import React, { memo, useMemo } from "react";
import styled from "styled-components/native";
import { ContentForApp, GetThemeResponse, Id } from "@refugies-info/api-types";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { Icon } from "react-native-eva-icons";
import { styles } from "../../theme";
import { TextDSFR_MD_Bold, TextDSFR_MD, TextDSFR_XS } from "../StyledText";
import NoLogo from "../../theme/images/contents/structure_no_logo.png";
import { DemarcheImage } from "./DemarcheImage";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import Highlight from "../Search/Highlight";
import { ReadableText } from "../ReadableText";
import { defaultColors } from "../../libs/getThemeTag";
import { Columns } from "../layout";

const IMAGE_SIZE = 58;

const ContentContainer = styled.TouchableOpacity<{
  isDispo: boolean;
  color?: string;
}>`
  background-color: ${({ isDispo, theme }) =>
    isDispo ? theme.colors.white : theme.colors.lightGrey};
  min-height: ${({ isDispo }) => (isDispo ? 80 : 72)}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.sm}
  border-width: ${({ isDispo }) => (!isDispo ? 2 : 0)}px;
  border-color: ${({ color }) => color || "transparent"};
  border-style: solid;
`;

const ImageContainer = styled.View<{ hasMatch?: boolean; lightColor?: string }>`
  justify-content: center;
  width: 64px;
  height: 64px;
  align-items: center;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
  border-width: 6px;
  border-color: ${({ hasMatch, theme }) =>
    hasMatch ? theme.colors.lightBlue : "transparent"};
  border-radius: ${({ theme }) => theme.radius * 2}px;
`;

const TitreInfoText = styled(TextDSFR_MD_Bold)<{
  color: string;
  isDispo?: boolean;
}>`
  color: ${({ color }) => color};
  margin-bottom: ${({ isDispo }) => (isDispo ? styles.margin : 0)}px;
`;

const DescInfoText = styled(TextDSFR_MD)<{ color: string }>`
  color: ${({ color }) => color};
  margin: ${styles.margin * 2}px;
`;

const TitreMarqueText = styled(TextDSFR_XS)<{ color: string }>`
  color: ${({ color }) => color};
`;

const TitlesContainer = styled.View`
  display: flex;
  flex: 1;
  align-items: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  padding-vertical: 16px;
  justify-content: center;
`;

const ActionButton = styled.TouchableOpacity`
  padding-horizontal: ${styles.margin * 2}px;
`;

interface Props {
  actionIcon?: string;
  actionLabel?: string;
  actionPress?: any;
  backScreen?: string;
  content: ContentForApp;
  hasSponsorMatch?: boolean;
  isTextNotBold?: boolean;
  needId?: Id;
  pressCallback?: () => void;
  searchItem?: any;
  searchLanguageMatch?: string;
  showAbstract?: boolean;
  style?: any;
  theme?: GetThemeResponse;
}

const logEventOnClick = (id: string) => {
  logEventInFirebase(FirebaseEvent.CLIC_CONTENT, {
    contentId: id,
  });
};

const ContentSummaryComponent = (props: Props) => {
  const navigation: any = useNavigation();
  const theme = useMemo(
    () => props.theme || (props.content.theme as GetThemeResponse),
    [props.theme, props.content.theme]
  );
  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);

  const actionButton = useMemo(
    () =>
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
      ) : null,
    [props.actionPress, props.actionLabel]
  );

  if (props.content.typeContenu === "dispositif") {
    return (
      <ContentContainer
        isDispo={true}
        style={props.style || {}}
        activeOpacity={0.8}
        accessibilityRole="button"
        onPress={() => {
          logEventOnClick(props.content._id);
          if (props.pressCallback) props.pressCallback();

          navigation.navigate("Explorer", {
            screen: "ContentScreen",
            params: {
              contentId: props.content._id,
              needId: props.needId,
              theme: theme,
              backScreen: props.backScreen,
            },
          });
        }}
      >
        <Columns layout="auto 1" RTLBehaviour verticalAlign="center">
          {props.content.sponsorUrl ? (
            <ImageContainer hasMatch={props.hasSponsorMatch}>
              <Image
                source={{ uri: props.content.sponsorUrl }}
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

          <TitlesContainer>
            <TitreInfoText color={colors.color100} isDispo={true}>
              {props.searchItem ? (
                <Highlight
                  hit={props.searchItem}
                  attribute={`title_${props.searchLanguageMatch || "fr"}`}
                  //@ts-ignore
                  color={colors.color100}
                />
              ) : (
                <ReadableText>
                  {props.content.titreInformatif || ""}
                </ReadableText>
              )}
            </TitreInfoText>
            {(!!props.content?.titreMarque ||
              !!props?.searchItem?.[
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
                  <ReadableText>{props.content.titreMarque || ""}</ReadableText>
                )}
              </TitreMarqueText>
            )}
          </TitlesContainer>
          {actionButton}
        </Columns>

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
        logEventOnClick(props.content._id);
        if (props.pressCallback) props.pressCallback();

        navigation.navigate("Explorer", {
          screen: "ContentScreen",
          params: {
            contentId: props.content._id,
            needId: props.needId,
            theme: theme,
            backScreen: props.backScreen,
          },
        });
      }}
    >
      <Columns layout="auto 1" RTLBehaviour verticalAlign="center">
        <ImageContainer lightColor={colors.color30}>
          <DemarcheImage
            icon={theme?.icon}
            stroke={colors.color100}
            contentId={props.content._id}
            isSmall={true}
          />
        </ImageContainer>

        <TitlesContainer>
          <TitreInfoText color={colors.color100}>
            {props.searchItem ? (
              <Highlight
                hit={props.searchItem}
                attribute={`title_${props.searchLanguageMatch || "fr"}`}
                //@ts-ignore
                color={colors.color100}
              />
            ) : (
              <ReadableText>{props.content.titreInformatif}</ReadableText>
            )}
          </TitreInfoText>
        </TitlesContainer>
        {actionButton}
      </Columns>

      {props.showAbstract && (
        <DescInfoText color={colors.color100}>
          <Highlight
            hit={props.searchItem}
            attribute={`abstract_${props.searchLanguageMatch || "fr"}`}
            // @ts-ignore
            color={colors.color100}
          />
        </DescInfoText>
      )}
    </ContentContainer>
  );
};

export const ContentSummary = memo(ContentSummaryComponent);
