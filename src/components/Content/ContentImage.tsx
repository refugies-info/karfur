import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { TextSmallNormal } from "../StyledText";
import { StreamlineIcon } from "../StreamlineIcon";
import { RTLView } from "../BasicComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { getImageNameFromContentId } from "../Contents/contentsIdDemarcheImageCorrespondency";
import { ObjectId } from "../../types/interface";
import { DemarcheImage } from "../Contents/DemarcheImage";

const getContainerDimensions = (imageName: string) => {
  if (
    [
      "ameli",
      "carteVitale",
      "permisConduire",
      "titreSejour",
      "carteBancaire",
      "carteIdentite",
      "covid",
      "poleEmploi",
      "ofpra",
      "caf",
    ].includes(imageName)
  ) {
    return { width: 80, height: 50 };
  }

  if (imageName === "passeport") {
    return { width: 80, height: 60 };
  }

  return { width: 80, height: 50 };
};
const StructureImageContainer = styled.View`
  background-color: ${theme.colors.white};
  display: flex;
  flex: 1;
  justify-content: center;
  border-radius: 8px;
`;

const StructureNameContainer = styled(StructureImageContainer)`
  padding: 4px;
`;

const StructureNameText = styled(TextSmallNormal)`
  text-align: center;
`;

const IconTextContainer = styled(RTLView)``;

const SponsorImageContainer = styled.View`
  width: ${(props: { width: number }) => props.width}px;
  height: ${(props: { height: number }) => props.height}px;
  background-color: ${theme.colors.lightGrey};
  z-index: 2;
  margin-top: ${(props: { height: number }) => -props.height / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 3}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 3 : 0}px;

  border-radius: ${theme.radius * 2}px;
  padding: 8px;
  display: flex;
  margin-bottom: ${theme.margin}px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
`;

interface Props {
  sponsorPictureUrl: string | null;
  sponsorName: string;
  typeContenu: "dispositif" | "demarche";
  iconName: string;
  contentId: ObjectId;
}

export const ContentImage = (props: Props) => {
  const { isRTL, t } = useTranslationWithRTL();

  const imageName = getImageNameFromContentId(props.contentId);

  if (props.typeContenu === "dispositif") {
    if (props.sponsorPictureUrl) {
      return (
        <SponsorImageContainer width={100} isRTL={isRTL} height={100}>
          <StructureImageContainer>
            <Image
              source={{
                uri: props.sponsorPictureUrl,
              }}
              resizeMode={"contain"}
              style={{
                height: 84,
                width: 84,
              }}
            />
          </StructureImageContainer>
        </SponsorImageContainer>
      );
    }
    return (
      <SponsorImageContainer width={160} isRTL={isRTL} height={100}>
        <StructureNameContainer>
          <StructureNameText numberOfLines={3}>
            {props.sponsorName}
          </StructureNameText>
        </StructureNameContainer>
      </SponsorImageContainer>
    );
  }

  if (imageName) {
    const { width, height } = getContainerDimensions(imageName);
    return (
      <SponsorImageContainer
        width={width}
        isRTL={isRTL}
        style={{ justifyContent: "center", alignItems: "center" }}
        height={height}
      >
        <DemarcheImage name="" stroke="" contentId={props.contentId} />
      </SponsorImageContainer>
    );
  }

  return (
    <SponsorImageContainer
      width={115}
      isRTL={isRTL}
      style={{ justifyContent: "center" }}
      height={40}
    >
      <IconTextContainer>
        <StreamlineIcon
          name={props.iconName}
          width={16}
          height={16}
          stroke={theme.colors.black}
        />
        <TextSmallNormal
          style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}
        >
          {t("Content.Démarche", "Démarche")}
        </TextSmallNormal>
      </IconTextContainer>
    </SponsorImageContainer>
  );
};
