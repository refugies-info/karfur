import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import { Page, Rows, Title } from "~/components";
import { TextDSFR_L, TextDSFR_L_Bold, TextDSFR_MD } from "~/components/StyledText";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { initHorizontalScroll } from "~/libs/rtlHorizontalScroll";
import { styles } from "~/theme";
import Contributif1 from "~/theme/images/aboutUs/contributif-1.png";
import Contributif2 from "~/theme/images/aboutUs/contributif-2.png";
import Contributif3 from "~/theme/images/aboutUs/contributif-3.png";
import Mission1 from "~/theme/images/aboutUs/mission-1.png";
import Mission2 from "~/theme/images/aboutUs/mission-2.png";
import Mission3 from "~/theme/images/aboutUs/mission-3.png";
import Problematique1 from "~/theme/images/aboutUs/problematique-1.png";
import Problematique2 from "~/theme/images/aboutUs/problematique-2.png";
import Problematique3 from "~/theme/images/aboutUs/problematique-3.png";
import { ProfileParamList } from "~/types/navigation";

const CARD_WIDTH = 280;

const Card = styled.View`
  width: ${CARD_WIDTH}px;
  padding: ${styles.margin * 2}px;
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
  ${styles.shadows.lg}
`;
const CardImage = styled.Image`
  width: 248px;
  height: 176px;
  align-self: center;
  margin-bottom: ${styles.margin * 2}px;
`;
const CardTitle = styled(TextDSFR_L_Bold)`
  margin-bottom: ${styles.margin}px;
  margin-top: ${styles.margin * 2}px;
`;

const stylesheet = StyleSheet.create({
  scrollview: {
    paddingHorizontal: styles.margin * 3,
    paddingTop: styles.margin * 2,
    paddingBottom: styles.margin,
    marginBottom: styles.margin,
  },
});

export const AboutScreen = ({}: StackScreenProps<ProfileParamList, "AboutScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();

  const scrollviewMissions = React.useRef<ScrollView>(null);
  const scrollviewProblematiques = React.useRef<ScrollView>(null);
  const scrollviewContributif = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    initHorizontalScroll([scrollviewMissions, scrollviewProblematiques, scrollviewContributif], isRTL);
  }, [isRTL]);

  return (
    <Page title={t("about_screen.about_us")}>
      <Rows>
        <TextDSFR_L>
          {t("about_screen.subheader1")} {t("about_screen.subheader2")}
        </TextDSFR_L>

        {/* MISSIONS */}
        <Title>{t("about_screen.missions")}</Title>
        <ScrollView
          ref={scrollviewMissions}
          contentContainerStyle={{
            ...stylesheet.scrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
              justifyContent: "space-between",
            }}
          >
            <CardImage source={Mission1} />
            <CardTitle>{t("about_screen.mission_3_header")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.mission_3_subheader")}</TextDSFR_MD>
          </Card>
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
              justifyContent: "space-between",
            }}
          >
            <CardImage source={Mission2} />
            <CardTitle>{t("about_screen.mission_2_header")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.mission_2_subheader")}</TextDSFR_MD>
          </Card>
          <Card>
            <CardImage source={Mission3} />
            <CardTitle>{t("about_screen.mission_1_header")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.mission_1_subheader")}</TextDSFR_MD>
          </Card>
        </ScrollView>

        {/* PROBLEMATIQUES */}
        <Title>{t("about_screen.issues")}</Title>
        <ScrollView
          ref={scrollviewProblematiques}
          contentContainerStyle={{
            ...stylesheet.scrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
            }}
          >
            <CardImage source={Problematique1} />
            <CardTitle>{t("about_screen.problem_1_header")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.problem_1_subheader")}</TextDSFR_MD>
          </Card>
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
            }}
          >
            <CardImage source={Problematique2} />
            <CardTitle>{t("about_screen.problem_2_header")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.problem_2_subheader")}</TextDSFR_MD>
          </Card>
          <Card>
            <CardImage source={Problematique3} />
            <CardTitle>{t("about_screen.problem_3_header2")}</CardTitle>
            <TextDSFR_MD>{t("about_screen.problem_3_subheader2")}</TextDSFR_MD>
          </Card>
        </ScrollView>

        {/* CONTRIBUTIF */}
        <Title>{t("about_screen.contributive_approach")}</Title>
        <ScrollView
          ref={scrollviewContributif}
          contentContainerStyle={{
            ...stylesheet.scrollview,
            paddingBottom: styles.margin * 4,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
              justifyContent: "space-between",
            }}
          >
            <View>
              <CardImage source={Contributif1} />
              <CardTitle>{t("about_screen.contributive_1_header2")}</CardTitle>
              <TextDSFR_MD>{t("about_screen.contributive_1_subheader")}</TextDSFR_MD>
            </View>
          </Card>
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
              justifyContent: "space-between",
            }}
          >
            <View>
              <CardImage source={Contributif2} />
              <CardTitle>{t("about_screen.contributive_2_header")}</CardTitle>
              <TextDSFR_MD>{t("about_screen.contributive_2_subheader")}</TextDSFR_MD>
            </View>
          </Card>
          <Card style={{ justifyContent: "space-between" }}>
            <View>
              <CardImage source={Contributif3} />
              <CardTitle>{t("about_screen.contributive_3_header")}</CardTitle>
              <TextDSFR_MD>{t("about_screen.contributive_3_subheader")}</TextDSFR_MD>
            </View>
          </Card>
        </ScrollView>
      </Rows>
    </Page>
  );
};
