import { isNull } from "lodash";
import React from "react";
import { Animated, View } from "react-native";
import styled from "styled-components/native";
import { Content, Sponsor, Theme } from "../../../types/interface";
import {
  ContentImage,
  getContainerDimensions,
} from "../../Content/ContentImage";
import { getImageNameFromContentId } from "../../Contents/contentsIdDemarcheImageCorrespondency";
import { ReadableText } from "../../ReadableText";
import { TextBigBold, TextSmallNormal } from "../../StyledText";
import { HeaderContentProps } from "./HeaderContentProps";

const TitlesContainer = styled(View)``;

const TitreInfoText = styled(TextBigBold)`
  opacity: 0.9;
  background-color: ${({ theme }) => theme.colors.white};
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  line-height: 40px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  padding: ${({ theme }) => theme.margin}px;
`;

const TitreMarqueText = styled(TextSmallNormal)`
  background-color: ${({ theme }) => theme.colors.white};
  opacity: 0.9;
  line-height: 32px;
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  padding: ${({ theme }) => theme.margin}px;
`;

export interface HeaderContentContentScreenProps extends HeaderContentProps {
  content: Content;
  sponsor: Sponsor;
  theme: Theme;
}

const HeaderContentContentScreen = ({
  content,
  sponsor,
  theme,
}: HeaderContentContentScreenProps) => {
  const imageName = getImageNameFromContentId(content._id);
  const bottom =
    content.typeContenu === "dispositif"
      ? -50
      : isNull(imageName)
      ? -25
      : -getContainerDimensions(imageName).height / 2;

  return (
    <Animated.View
      style={{
        position: "relative",
        marginTop: 20,
      }}
    >
      <TitlesContainer>
        <TitreInfoText>
          <ReadableText>{content.titreInformatif || ""}</ReadableText>
        </TitreInfoText>

        {!!content.titreMarque && (
          <TitreMarqueText>
            <ReadableText>{"avec " + content.titreMarque}</ReadableText>
          </TitreMarqueText>
        )}
      </TitlesContainer>
      <View style={{ bottom }}>
        <ContentImage
          sponsorName={sponsor.nom}
          sponsorPictureUrl={sponsor.picture?.secure_url || null}
          typeContenu={content.typeContenu}
          icon={theme?.icon}
          contentId={content._id}
        />
      </View>
    </Animated.View>
  );
};

export default HeaderContentContentScreen;
