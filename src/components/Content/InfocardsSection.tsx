import * as React from "react";
import styled from "styled-components/native";
import {
  TextNormalBold,
  TextVerySmallNormal,
  TextSmallNormal,
} from "../StyledText";
import { DispositifContent } from "../../types/interface";
import { styles } from "../../theme";
import { formatInfocards, getDescription } from "../../libs/content";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { infocardsCorrespondencyNames } from "./data";
import { TextFromHtml } from "./TextFromHtml";
import { RTLView } from "../BasicComponents";
import { View } from "react-native";
import { InfocardImage } from "./InfocardImage";
import { ReadableText } from "../ReadableText";

interface Props {
  content: DispositifContent[];
  color: string;
  typeContenu: "dispositif" | "demarche";
}

const MainContainer = styled.View`
  display: flex;
  flex-direction: column;
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
  padding-top: ${styles.margin * 2}px;
  ${styles.shadows.lg}
  margin-top: ${styles.margin}px;
  margin-horizontal: ${styles.margin * 3}px;
`;

const TitleText = styled(TextNormalBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${styles.radius * 2}px;
`;

const SubtitleText = styled(TextVerySmallNormal)`
  color: ${styles.colors.darkGrey};
`;

const DescriptionText = styled(TextSmallNormal)`
  margin-top: 4px;
  flex-shrink: 1;
`;

const SectionContainer = styled.View`
  padding-horizontal: ${styles.margin * 2}px;
`;

const InfocardContainer = styled.View`
  margin-bottom: ${(props: { isDuree: boolean }) =>
    props.isDuree ? styles.margin : styles.margin * 3}px;
`;

const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${styles.colors.grey};
  margin-bottom: ${styles.margin * 3}px;
  margin-top: ${styles.margin}px;
`;

const InfocardTextContainer = styled.View`
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
          <View key={indexSection}>
            <SectionContainer>
              <TitleText color={props.color}>
                <ReadableText>
                  {t("content_screen." + data.title, data.title)}
                  </ReadableText>
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
                            <ReadableText>
                              {t("content_screen." + displayedName, displayedName)}
                            </ReadableText>
                          </SubtitleText>
                        )}
                        {!!description && (
                          <View>
                            <DescriptionText>
                              <ReadableText>
                                {description}
                                </ReadableText>
                              </DescriptionText>
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
          </View>
        );
      })}
    </MainContainer>
  );
};
