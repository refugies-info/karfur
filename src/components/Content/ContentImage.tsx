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
    return { width: CONTAINER_SIZE, height: 56 + styles.margin * 2 };
  }

  if (imageName === "passeport") {
    return { width: 60 + styles.margin * 2, height: CONTAINER_SIZE };
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

const SponsorImageContainer = styled.View<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.lightGrey};
  z-index: 2;
  margin-top: ${({ height }) => -height / 2}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin * 3)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 3 : 0)}px;

  border-radius: ${({ theme }) => theme.radius * 2}px;
  padding: ${({ theme }) => theme.margin}px;
  display: flex;
  margin-bottom: ${({ theme }) => theme.margin}px;
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
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
        <SponsorImageContainer width={CONTAINER_SIZE} height={CONTAINER_SIZE}>
          <StructureImageContainer>
            <Image
              source={{ uri: props.sponsorPictureUrl }}
              resizeMode={"contain"}
              style={{
                height: CONTAINER_SIZE - styles.margin * 2,
                width: CONTAINER_SIZE - styles.margin * 2,
              }}
            />
          </StructureImageContainer>
        </SponsorImageContainer>
      );
    }
    return (
      // no image
      <SponsorImageContainer width={160} height={CONTAINER_SIZE}>
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
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <DemarcheImage contentId={props.contentId} />
      </SponsorImageContainer>
    );
  }

  return (
    // no image
    <SponsorImageContainer
      width={115}
      height={40}
      style={{ justifyContent: "center" }}
    >
      <IconTextContainer>
        {props.icon && (
          <StreamlineIcon
            icon={props.icon}
            size={16}
            stroke={styles.colors.black}
          />
        )}
        <TextSmallNormal
          style={{
            marginLeft: isRTL ? 0 : styles.margin,
            marginRight: isRTL ? styles.margin : 0,
          }}
        >
          {t("content_screen.procedure", "Démarche")}
        </TextSmallNormal>
      </IconTextContainer>
    </SponsorImageContainer>
  );
};
