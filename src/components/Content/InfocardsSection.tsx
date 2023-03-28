import * as React from "react";
import styled from "styled-components/native";
import {
  TextNormalBold,
  TextVerySmallNormal,
  TextSmallNormal,
} from "../StyledText";
import { formatInfocards, getDescription } from "../../libs/content";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { TextFromHtml } from "./TextFromHtml";
import { RTLView } from "../BasicComponents";
import { View } from "react-native";
import { InfocardImage } from "./InfocardImage";
import { ReadableText } from "../ReadableText";
import { ContentType, Metadatas } from "@refugies-info/api-types";

interface Props {
  content: Metadatas;
  color: string;
  typeContenu: ContentType;
}

const MainContainer = styled.View`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  padding-top: ${({ theme }) => theme.margin * 2}px;
  ${({ theme }) => theme.shadows.lg}
  margin-top: ${({ theme }) => theme.margin}px;
`;

const TitleText = styled(TextNormalBold)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.radius * 2}px;
`;

const SubtitleText = styled(TextVerySmallNormal)`
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const DescriptionText = styled(TextSmallNormal)`
  margin-top: 4px;
  flex-shrink: 1;
`;

const SectionContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
`;

const InfocardContainer = styled.View<{ isDuree: boolean }>`
  margin-bottom: ${({ isDuree, theme }) =>
    isDuree ? theme.margin : theme.margin * 3}px;
`;

const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-bottom: ${({ theme }) => theme.margin * 3}px;
  margin-top: ${({ theme }) => theme.margin}px;
`;

const InfocardTextContainer = styled.View`
  flex: 1;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : 8)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 8 : 0)}px;
`;

interface CardProps {
  data: any;
  color: string;
  title: string;
}

const Card = ({ data, color, title }: CardProps) => {
  const { t } = useTranslationWithRTL();

  return (
    <View>
      <SectionContainer>
        <TitleText color={color}>
          <ReadableText>{t("content_screen." + title, title)}</ReadableText>
        </TitleText>
        {data.map((infocard: any, key: any) => {
          // FIXME not supported yet
          if (infocard.title === "publicStatus") return;

          const displayedName = infocard.title;
          const description = getDescription(infocard, t);

          return (
            <InfocardContainer
              key={key}
              isDuree={infocard.title === "duration"}
            >
              <RTLView style={{ justifyContent: "space-between" }}>
                <InfocardTextContainer>
                  {!!displayedName && (
                    <SubtitleText>
                      <ReadableText>
                        {t("content_screen." + displayedName, displayedName)}
                      </ReadableText>
                    </SubtitleText>
                  )}
                  {!!description && (
                    <View>
                      <DescriptionText>
                        <ReadableText>{description}</ReadableText>
                      </DescriptionText>
                    </View>
                  )}
                  {infocard.title === "duration" && infocard.contentTitle && (
                    <TextFromHtml htmlContent={infocard.contentTitle} />
                  )}
                  {infocard.title === "important" && infocard.contentTitle && (
                    <TextFromHtml htmlContent={infocard.contentTitle} />
                  )}
                </InfocardTextContainer>
                <InfocardImage
                  title={infocard.title}
                  isFree={
                    infocard.title === "price" &&
                    infocard.filteredData.values[0] === 0
                  }
                />
              </RTLView>
            </InfocardContainer>
          );
        })}
      </SectionContainer>
    </View>
  );
};

export const InfocardsSection = ({ content, color, typeContenu }: Props) => {
  const formattedData = formatInfocards(content, typeContenu);
  if (formattedData.length === 0) {
    return <View />;
  }
  const keys = Object.keys(formattedData);
  return (
    <MainContainer>
      {keys.map((key, indexSection) => (
        <>
          <Card
            key={`${key}-card`}
            data={formattedData[key]}
            title={key}
            color={color}
          />
          {indexSection !== keys.length - 1 && (
            <Separator key={`${key}-separator`} />
          )}
        </>
      ))}
    </MainContainer>
  );
};
