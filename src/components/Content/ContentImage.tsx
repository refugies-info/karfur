import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { TextSmallNormal } from "../StyledText";
import { StreamlineIcon } from "../StreamlineIcon";
import { RTLView } from "../BasicComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { getImageNameFromContentId } from "../Contents/contentsIdDemarcheImageCorrespondency";
import { ObjectId, Picture } from "../../types/interface";
import { DemarcheImage } from "../Contents/DemarcheImage";

const CONTAINER_SIZE = 100;

const getContainerDimensions = (imageName: string) => {
  if (
    [
      "carteBancaire",
      "carteIdentite",
      "carteVitale",
      "permisConduire",
      "titreSejour",
    ].includes(imageName)
  ) {
    return { width: CONTAINER_SIZE, height: (56 + styles.margin * 2) };
  }

  if (imageName === "passeport") {
    return { width: (60 + styles.margin * 2), height: CONTAINER_SIZE };
  }

  return { width: CONTAINER_SIZE, height: CONTAINER_SIZE };
};
const StructureImageContainer = styled.View`
  background-color: ${styles.colors.white};
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
  background-color: ${styles.colors.lightGrey};
  z-index: 2;
  margin-top: ${(props: { height: number }) => -props.height / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin * 3}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 3 : 0}px;

  border-radius: ${styles.radius * 2}px;
  padding: ${styles.margin}px;
  display: flex;
  margin-bottom: ${styles.margin}px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
`;

interface Props {
  sponsorPictureUrl: string | null;
  sponsorName: string;
  typeContenu: "dispositif" | "demarche";
  icon?: Picture;
  contentId: ObjectId;
}

export const ContentImage = (props: Props) => {
  const { isRTL, t } = useTranslationWithRTL();

  const imageName = getImageNameFromContentId(props.contentId);

  // DISPOSITIF
  if (props.typeContenu === "dispositif") {
    if (props.sponsorPictureUrl) {
      return (
        <SponsorImageContainer
          width={CONTAINER_SIZE}
          height={CONTAINER_SIZE}
          isRTL={isRTL}
        >
          <StructureImageContainer>
            <Image
              source={{ uri: props.sponsorPictureUrl }}
              resizeMode={"contain"}
              style={{
                height: CONTAINER_SIZE - (styles.margin * 2),
                width: CONTAINER_SIZE - (styles.margin * 2),
              }}
            />
          </StructureImageContainer>
        </SponsorImageContainer>
      );
    }
    return ( // no image
      <SponsorImageContainer
        width={160}
        height={CONTAINER_SIZE}
        isRTL={isRTL}
      >
        <StructureNameContainer>
          <StructureNameText numberOfLines={3}>
            {props.sponsorName}
          </StructureNameText>
        </StructureNameContainer>
      </SponsorImageContainer>
    );
  }

  // DEMARCHE
  if (imageName) {
    const { width, height } = getContainerDimensions(imageName);
    return (
      <SponsorImageContainer
        width={width}
        height={height}
        isRTL={isRTL}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <DemarcheImage contentId={props.contentId} />
      </SponsorImageContainer>
    );
  }

  return ( // no image
    <SponsorImageContainer
      width={115}
      height={40}
      isRTL={isRTL}
      style={{ justifyContent: "center" }}
    >
      <IconTextContainer>
        {props.icon &&
          <StreamlineIcon
          icon={props.icon}
          size={16}
          stroke={styles.colors.black}
          />
        }
        <TextSmallNormal
          style={{
            marginLeft: isRTL ? 0 : styles.margin,
            marginRight: isRTL ? styles.margin : 0
          }}
        >
          {t("content_screen.procedure", "Démarche")}
        </TextSmallNormal>
      </IconTextContainer>
    </SponsorImageContainer>
  );
};
