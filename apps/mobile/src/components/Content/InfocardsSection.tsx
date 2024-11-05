import { conditionType, ContentType, GetDispositifResponse, Metadatas } from "@refugies-info/api-types";
import React, { memo, useMemo } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getConditionImage, getDescriptionNew } from "~/libs/content";
import { styles } from "~/theme";
import { ReadableText } from "../ReadableText";
import { TextDSFR_L_Bold, TextDSFR_MD, TextDSFR_MD_Bold } from "../StyledText";
import { Columns, Rows, RowsSpacing } from "../layout";
import { Title } from "../typography";
import { IMAGE_SIZE, InfocardImage } from "./InfocardImage";

interface Props {
  content: GetDispositifResponse;
  color: string;
}

const MainContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.lightGrey};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 5}px;
`;

const TitleText = styled(TextDSFR_L_Bold)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.radius * 2}px;
`;

const SubtitleText = styled(TextDSFR_MD_Bold)`
  color: ${({ theme }) => theme.colors.black};
`;

const DescriptionText = styled(TextDSFR_MD)`
  margin-top: 4px;
`;

const SectionContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
`;

const InfocardTextContainer = styled.View`
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : 8)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 8 : 0)}px;
`;

const Metadata = ({
  color,
  metadatas,
  metadataKey,
  withTitle = false,
}: {
  color: string;
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
    <Columns
      RTLBehaviour
      layout="auto 1"
      horizontalAlign="space-between"
      verticalAlign="flex-start"
      style={{ marginBottom: styles.margin * 3 }}
    >
      <InfocardImage
        color={color}
        isFree={metadataKey === "price" && metadatas.price?.values[0] === 0}
        title={metadataKey}
      />
      <InfocardTextContainer>
        {withTitle && (
          <SubtitleText>
            <ReadableText>{t("Infocards." + metadataKey, metadataKey)}</ReadableText>
          </SubtitleText>
        )}
        <DescriptionText>
          <ReadableText>{getDescriptionNew(metadatas, metadataKey, t)}</ReadableText>
        </DescriptionText>
      </InfocardTextContainer>
    </Columns>
  );
};

const Section = ({ children, color, title }: { children: React.ReactNode; color: string; title: string }) => (
  <SectionContainer>
    <TitleText color={color}>
      <ReadableText>{title}</ReadableText>
    </TitleText>

    <Rows layout="1">{children}</Rows>
  </SectionContainer>
);

const InfocardsSectionComponent = ({ content, color }: Props) => {
  const { t } = useTranslationWithRTL();
  const metadatas = useMemo(() => content.metadatas, [content.metadatas]);
  return (
    <>
      <Title color={color} accessibilityRole="header">
        <ReadableText>{t("content_screen.informations", "Informations importantes")}</ReadableText>
      </Title>
      <MainContainer>
        <Rows separator spacing={RowsSpacing.Default}>
          <Section color={color} title={t("Infocards.publicTitle", "Public visé")}>
            <Metadata color={color} metadatas={metadatas} metadataKey="publicStatus" withTitle />
            {metadatas.public && <Metadata color={color} metadatas={metadatas} metadataKey="public" withTitle />}

            <Metadata color={color} metadatas={metadatas} metadataKey="frenchLevel" withTitle />
            <Metadata color={color} metadatas={metadatas} metadataKey="age" withTitle />
          </Section>

          {metadatas.price && (
            <Section color={color} title={t("Infocards.price", "Prix")}>
              <Metadata color={color} metadatas={metadatas} metadataKey="price" />
            </Section>
          )}

          {(metadatas.commitment || metadatas.frequency || metadatas.timeSlots) && (
            <Section color={color} title={t("Infocards.availability", "Disponibilité demandée")}>
              {metadatas.commitment && (
                <Metadata color={color} metadatas={metadatas} metadataKey="commitment" withTitle />
              )}
              {metadatas.frequency && (
                <Metadata color={color} metadatas={metadatas} metadataKey="frequency" withTitle />
              )}
              {metadatas.timeSlots && (
                <Metadata color={color} metadatas={metadatas} metadataKey="timeSlots" withTitle />
              )}
            </Section>
          )}

          {metadatas.conditions && (
            <Section color={color} title={t("Infocards.conditions", "Conditions")}>
              {/* <Metadata metadatas={metadatas} metadataKey="conditions" /> */}
              <Rows layout="1" spacing={RowsSpacing.Text}>
                {metadatas.conditions.map((condition: conditionType) => (
                  <Columns layout="auto 1" key={condition}>
                    {getConditionImage(condition)}
                    <DescriptionText>
                      <ReadableText>{t(`Infocards.${condition}`, condition)}</ReadableText>
                    </DescriptionText>
                  </Columns>
                ))}
              </Rows>
            </Section>
          )}

          {content.typeContenu === ContentType.DISPOSITIF && metadatas.location && (
            <Section color={color} title={t("Infocards.location", "Zone d'action")}>
              <Metadata color={color} metadatas={metadatas} metadataKey="location" />
            </Section>
          )}

          {content.mainSponsor && (
            <Section color={color} title={t("Infocards.proposedBy", "Proposé par")}>
              <Columns RTLBehaviour layout="auto 1" horizontalAlign="space-between">
                {content.mainSponsor.picture?.secure_url && (
                  <Image
                    source={{ uri: content.mainSponsor.picture.secure_url }}
                    style={{
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                      resizeMode: "contain",
                    }}
                  />
                )}
                <DescriptionText>
                  <ReadableText>{content.mainSponsor.nom}</ReadableText>
                </DescriptionText>
              </Columns>
            </Section>
          )}
        </Rows>
      </MainContainer>
    </>
  );
};

export const InfocardsSection = memo(InfocardsSectionComponent);
