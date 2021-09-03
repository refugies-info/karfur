import * as React from "react";
import styled from "styled-components/native";
import {
  TextNormalBold,
  TextVerySmallNormal,
  TextSmallNormal,
} from "../StyledText";
import { DispositifContent } from "../../types/interface";
import { theme } from "../../theme";
import { formatInfocards, getDescription } from "../../libs/content";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { infocardsCorrespondencyNames } from "./data";
import { TextFromHtml } from "./TextFromHtml";
import { RTLView } from "../BasicComponents";
import { View } from "react-native";
import { InfocardImage } from "./InfocardImage";

interface Props {
  content: DispositifContent[];
  color: string;
  typeContenu: "dispositif" | "demarche";
}

const MainContainer = styled.View`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding-top: ${theme.margin * 2}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 1;
  margin-top: ${theme.margin}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const TitleText = styled(TextNormalBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${theme.radius * 2}px;
`;

const SubtitleText = styled(TextVerySmallNormal)`
  color: ${theme.colors.darkGrey};
`;

const DescriptionText = styled(TextSmallNormal)`
  margin-top: 4px;
  flex-shrink: 1;
`;

const SectionContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
`;

const InfocardContainer = styled.View`
  margin-bottom: ${(props: { isDuree: boolean }) =>
    props.isDuree ? theme.margin : theme.margin * 3}px;
`;

const Separator = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${theme.colors.grey};
  margin-bottom: ${theme.margin * 3}px;
  margin-top: ${theme.margin}px;
`;

const InfocardTextContainer = styled.View`
  flex-wrap: wrap;
  flex: 1;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : 8)}px;
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 8 : 0)}px;
`;

export const InfocardsSection = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const formattedData = formatInfocards(props.content, props.typeContenu);

  if (formattedData.length === 0) {
    return <View />;
  }
  return (
    <MainContainer>
      {formattedData.map((data, indexSection) => {
        return (
          <>
            <SectionContainer key={indexSection}>
              <TitleText color={props.color}>
                {t("Content." + data.title, data.title)}
              </TitleText>
              {data.filteredData.map((infocard, key) => {
                const displayedName =
                  infocardsCorrespondencyNames.filter(
                    (data) => data.databaseName === infocard.title
                  ).length > 0
                    ? infocardsCorrespondencyNames.filter(
                        (data) => data.databaseName === infocard.title
                      )[0].displayedName
                    : null;

                const description = getDescription(infocard, t);
                return (
                  <InfocardContainer
                    key={key}
                    isDuree={infocard.title === "Durée"}
                  >
                    <RTLView style={{ justifyContent: "space-between" }}>
                      <InfocardTextContainer isRTL={isRTL}>
                        {!!displayedName && (
                          <SubtitleText>
                            {t("Content." + displayedName, displayedName)}
                          </SubtitleText>
                        )}
                        {!!description && (
                          <View>
                            <DescriptionText>{description}</DescriptionText>
                          </View>
                        )}
                        {infocard.title === "Durée" &&
                          infocard.contentTitle && (
                            <TextFromHtml htmlContent={infocard.contentTitle} />
                          )}
                        {infocard.title === "Important !" &&
                          infocard.contentTitle && (
                            <TextFromHtml htmlContent={infocard.contentTitle} />
                          )}
                      </InfocardTextContainer>
                      <InfocardImage
                        title={infocard.title}
                        isFree={!!infocard.free}
                      />
                    </RTLView>
                  </InfocardContainer>
                );
              })}
            </SectionContainer>
            {indexSection !== formattedData.length - 1 && <Separator />}
          </>
        );
      })}
    </MainContainer>
  );
};
