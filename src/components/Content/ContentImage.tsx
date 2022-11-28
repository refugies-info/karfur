import React from "react";
import { Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { styles } from "../../theme";
import { TextSmallNormal } from "../StyledText";
import { StreamlineIcon } from "../StreamlineIcon";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { getImageNameFromContentId } from "../Contents/contentsIdDemarcheImageCorrespondency";
import { ObjectId, Picture } from "../../types/interface";
import { DemarcheImage } from "../Contents/DemarcheImage";
import Columns from "../layout/Columns";
import { ReadableText } from "../ReadableText";

const CONTAINER_SIZE = 100;

export const getContainerDimensions = (imageName: string) => {
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
  background-color: ${({ theme }) => theme.colors.white};
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

const SponsorImageContainer = styled.View<{ width?: number; height: number }>`
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.lightGrey};
  z-index: 2;
  margin-top: ${({ height }) => -height / 2}px;

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
  const { t } = useTranslationWithRTL();
  const theme = useTheme();

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
            <ReadableText>{props.sponsorName}</ReadableText>
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
    <SponsorImageContainer height={40}>
      <Columns layout="auto" RTLBehaviour verticalAlign="center">
        {props.icon && (
          <StreamlineIcon
            icon={props.icon}
            size={16}
            stroke={theme.colors.black}
          />
        )}
        <TextSmallNormal>
          <ReadableText>
            {t("content_screen.procedure", "Démarche")}
          </ReadableText>
        </TextSmallNormal>
      </Columns>
    </SponsorImageContainer>
  );
};
