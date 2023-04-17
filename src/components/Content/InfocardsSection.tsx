import * as React from "react";
import styled from "styled-components/native";
import { TextNormalBold, TextSmallBold, TextSmallNormal } from "../StyledText";
import { getConditionImage, getDescriptionNew } from "../../libs/content";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { IMAGE_SIZE, InfocardImage } from "./InfocardImage";
import { ReadableText } from "../ReadableText";
import {
  conditionType,
  ContentType,
  GetDispositifResponse,
  Metadatas,
} from "@refugies-info/api-types";
import { Columns, Rows, RowsSpacing } from "../layout";
import { Image } from "react-native";

interface Props {
  content: GetDispositifResponse;
  color: string;
}

const MainContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.lightGrey};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
  margin-vertical: ${({ theme }) => theme.margin}px;
`;

const TitleText = styled(TextNormalBold)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.radius * 2}px;
`;

const SubtitleText = styled(TextSmallBold)`
  color: ${({ theme }) => theme.colors.black};
`;

const DescriptionText = styled(TextSmallNormal)`
  margin-top: 4px;
  flex-shrink: 1;
`;

const SectionContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
`;

const InfocardTextContainer = styled.View`
  flex: 1;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : 8)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 8 : 0)}px;
`;

const Metadata = ({
  metadatas,
  metadataKey,
  withTitle = false,
}: {
  metadatas: Metadatas;
  metadataKey: keyof Metadatas;
  withTitle?: boolean;
}) => {
  const { t } = useTranslationWithRTL();
  /**
   * Exception : some Metadata must  be display in any case
   * - frenchLevel
   * - publicStatus
   * - age
   */
  if (
    !metadatas[metadataKey] &&
    metadataKey !== "frenchLevel" &&
    metadataKey !== "age" &&
    metadataKey !== "publicStatus"
  )
    return null;

  return (
    <Columns RTLBehaviour layout="auto 1" horizontalAlign="space-between">
      <InfocardImage
        title={metadataKey}
        isFree={metadataKey === "price" && metadatas.price?.values[0] === 0}
      />
      <InfocardTextContainer>
        {withTitle && (
          <SubtitleText>
            <ReadableText>
              {t("content_screen." + metadataKey, metadataKey)}
            </ReadableText>
          </SubtitleText>
        )}
        <DescriptionText>
          <ReadableText>
            {getDescriptionNew(metadatas, metadataKey, t)}
          </ReadableText>
        </DescriptionText>
      </InfocardTextContainer>
    </Columns>
  );
};

const Section = ({
  children,
  color,
  title,
}: {
  children: React.ReactNode;
  color: string;
  title: string;
}) => (
  <SectionContainer>
    <TitleText color={color}>
      <ReadableText>{title}</ReadableText>
    </TitleText>

    <Rows>{children}</Rows>
  </SectionContainer>
);

export const InfocardsSection = ({ content, color }: Props) => {
  const { t } = useTranslationWithRTL();
  const metadatas = content.metadatas;
  return (
    <MainContainer>
      <Rows separator>
        <Section
          color={color}
          title={t("content_screen.public", "Public visé")}
        >
          <Metadata
            metadatas={metadatas}
            metadataKey="publicStatus"
            withTitle
          />
          {metadatas.public && (
            <Metadata metadatas={metadatas} metadataKey="public" withTitle />
          )}

          <Metadata metadatas={metadatas} metadataKey="frenchLevel" withTitle />
          <Metadata metadatas={metadatas} metadataKey="age" withTitle />
        </Section>

        {metadatas.price && (
          <Section color={color} title={t("content_screen.price", "Prix")}>
            <Metadata metadatas={metadatas} metadataKey="price" />
          </Section>
        )}

        {(metadatas.commitment ||
          metadatas.frequency ||
          metadatas.timeSlots) && (
          <Section
            color={color}
            title={t("content_screen.availability", "Disponibilité demandée")}
          >
            {metadatas.commitment && (
              <Metadata metadatas={metadatas} metadataKey="commitment" />
            )}
            {metadatas.frequency && (
              <Metadata metadatas={metadatas} metadataKey="frequency" />
            )}
            {metadatas.timeSlots && (
              <Metadata metadatas={metadatas} metadataKey="timeSlots" />
            )}
          </Section>
        )}

        {metadatas.conditions && (
          <Section
            color={color}
            title={t("content_screen.conditions", "Conditions")}
          >
            {/* <Metadata metadatas={metadatas} metadataKey="conditions" /> */}
            <Rows layout="1" spacing={RowsSpacing.Text}>
              {metadatas.conditions.map((condition: conditionType) => (
                <Columns layout="auto 1" key={condition}>
                  <Image
                    style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                    source={getConditionImage(condition)}
                  />
                  <DescriptionText>
                    <ReadableText>
                      {t(
                        `content_screen.conditions_${condition.replaceAll(
                          " ",
                          "_"
                        )}`,
                        condition
                      )}
                    </ReadableText>
                  </DescriptionText>
                </Columns>
              ))}
            </Rows>
          </Section>
        )}

        {content.typeContenu === ContentType.DISPOSITIF &&
          metadatas.location && (
            <Section
              color={color}
              title={t("content_screen.location", "Zone d'action")}
            >
              <Metadata metadatas={metadatas} metadataKey="location" />
            </Section>
          )}

        {content.mainSponsor && (
          <Section
            color={color}
            title={t("content_screen.mainSponsor", "Proposé par")}
          >
            <Columns
              RTLBehaviour
              layout="auto 1"
              horizontalAlign="space-between"
            >
              <Image
                source={{ uri: content.mainSponsor.picture.secure_url }}
                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
              />
              <DescriptionText>
                <ReadableText>{content.mainSponsor.nom}</ReadableText>
              </DescriptionText>
            </Columns>
          </Section>
        )}
      </Rows>
    </MainContainer>
  );
};
