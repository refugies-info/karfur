import React from "react";
import {
  GetDispositifResponse,
  GetThemeResponse,
} from "@refugies-info/api-types";
import { isNull } from "lodash";
import { View } from "react-native";
import styled from "styled-components/native";
import { Sponsor } from "../../../types/interface";
import {
  ContentImage,
  getContainerDimensions,
} from "../../Content/ContentImage";
import { getImageNameFromContentId } from "../../Contents/contentsIdDemarcheImageCorrespondency";
import { ReadableText } from "../../ReadableText";
import { TextBigBold, TextSmallNormal } from "../../StyledText";
import { HeaderContentProps } from "./HeaderContentProps";

const Container = styled.View`
  position: relative;
`;

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
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;

export interface HeaderContentContentScreenProps extends HeaderContentProps {
  content: GetDispositifResponse;
  sponsor: Sponsor;
  theme: GetThemeResponse;
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
    <Container>
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
          contentId={content._id.toString()}
        />
      </View>
    </Container>
  );
};

export default HeaderContentContentScreen;
