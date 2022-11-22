import * as React from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import * as Linking from "expo-linking";
import {
  TextNormal,
  TextSmallNormal,
  TextNormalBold,
  TextSmallBold,
} from "../../components/StyledText";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { initHorizontalScroll } from "../../libs/rtlHorizontalScroll";
import { CustomButton } from "../../components/CustomButton";
import Contributif1 from "../../theme/images/aboutUs/contributif-1.png";
import Contributif2 from "../../theme/images/aboutUs/contributif-2.png";
import Contributif3 from "../../theme/images/aboutUs/contributif-3.png";
import Mission1 from "../../theme/images/aboutUs/mission-1.png";
import Mission2 from "../../theme/images/aboutUs/mission-2.png";
import Mission3 from "../../theme/images/aboutUs/mission-3.png";
import Problematique1 from "../../theme/images/aboutUs/problematique-1.png";
import Problematique2 from "../../theme/images/aboutUs/problematique-2.png";
import Problematique3 from "../../theme/images/aboutUs/problematique-3.png";
import { RTLView } from "../../components/BasicComponents";
import { partners, membres } from "../../data/aboutUs";
import { Page, Rows, Title } from "../../components";

const CARD_WIDTH = 280;
const LOGO_WIDTH = 104;
const LOGO_HEIGHT = 80;

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
const CardTitle = styled(TextNormalBold)`
  margin-bottom: ${styles.margin}px;
  margin-top: ${styles.margin * 2}px;
`;
const LogoContainer = styled.View`
  padding: ${styles.margin * 2}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? styles.margin * 3 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 3 : 0}px;
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
`;
const LogoImage = styled.Image`
  width: ${LOGO_WIDTH}px;
  height: ${LOGO_HEIGHT}px;
`;
const TeamContainer = styled.ScrollView`
  padding-horizontal: ${styles.margin * 3}px;
  margin-bottom: ${styles.margin * 3}px;
`;
const TeamItem = styled(RTLView)`
  padding: ${styles.margin * 2}px;
  border-width: 2px;
  border-color: ${styles.colors.benevolat100};
  background-color: ${styles.colors.benevolat30};
  border-radius: ${styles.radius * 2}px;
  margin-bottom: ${styles.margin * 2}px;
`;
const TeamDetails = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 3 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? styles.margin * 3 : 0}px;
  flex-shrink: 1;
  flex-grow: 0;
`;
const TeamName = styled(TextSmallBold)`
  background-color: ${styles.colors.white};
  margin-bottom: ${styles.margin}px;
  padding: ${styles.margin / 2}px;
  width: auto;
`;
const TeamRole = styled(TextSmallNormal)`
  flex-wrap: wrap;
`;

const stylesheet = StyleSheet.create({
  scrollview: {
    paddingHorizontal: styles.margin * 3,
    paddingTop: styles.margin * 2,
    paddingBottom: styles.margin,
    marginBottom: styles.margin,
  },
  logoScrollview: {
    paddingTop: styles.margin * 2,
    paddingBottom: styles.margin,
    marginBottom: styles.margin,
  },
});

const sortPartners = () =>
  partners.sort((a, b) => {
    if (a.date === b.date) return 0;
    if (a.date > b.date) return 1;
    return -1;
  });

export const AboutScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "AboutScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();

  const scrollviewMissions = React.useRef<ScrollView>(null);
  const scrollviewProblematiques = React.useRef<ScrollView>(null);
  const scrollviewContributif = React.useRef<ScrollView>(null);
  const scrollviewPartners = React.useRef<ScrollView>(null);
  const sortedPartners = sortPartners();

  React.useEffect(() => {
    initHorizontalScroll(
      [
        scrollviewMissions,
        scrollviewProblematiques,
        scrollviewContributif,
        scrollviewPartners,
      ],
      isRTL
    );
  }, [isRTL]);

  return (
    <Page title={t("about_screen.about_us")}>
      <Rows>
        <TextNormal>
          {t("about_screen.subheader1")} {t("about_screen.subheader2")}
        </TextNormal>

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
            <TextSmallNormal>
              {t("about_screen.mission_3_subheader")}
            </TextSmallNormal>
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
            <TextSmallNormal>
              {t("about_screen.mission_2_subheader")}
            </TextSmallNormal>
          </Card>
          <Card>
            <CardImage source={Mission3} />
            <CardTitle>{t("about_screen.mission_1_header")}</CardTitle>
            <TextSmallNormal>
              {t("about_screen.mission_1_subheader")}
            </TextSmallNormal>
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
            <TextSmallNormal>
              {t("about_screen.problem_1_subheader")}
            </TextSmallNormal>
          </Card>
          <Card
            style={{
              marginRight: !isRTL ? styles.margin * 3 : 0,
              marginLeft: isRTL ? styles.margin * 3 : 0,
            }}
          >
            <CardImage source={Problematique2} />
            <CardTitle>{t("about_screen.problem_2_header")}</CardTitle>
            <TextSmallNormal>
              {t("about_screen.problem_2_subheader")}
            </TextSmallNormal>
          </Card>
          <Card>
            <CardImage source={Problematique3} />
            <CardTitle>{t("about_screen.problem_3_header2")}</CardTitle>
            <TextSmallNormal>
              {t("about_screen.problem_3_subheader2")}
            </TextSmallNormal>
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
              <TextSmallNormal>
                {t("about_screen.contributive_1_subheader")}
              </TextSmallNormal>
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
              <TextSmallNormal>
                {t("about_screen.contributive_2_subheader")}
              </TextSmallNormal>
            </View>
          </Card>
          <Card style={{ justifyContent: "space-between" }}>
            <View>
              <CardImage source={Contributif3} />
              <CardTitle>{t("about_screen.contributive_3_header")}</CardTitle>
              <TextSmallNormal>
                {t("about_screen.contributive_3_subheader")}
              </TextSmallNormal>
            </View>
          </Card>
        </ScrollView>

        {/* PARTENAIRES */}
        <Title>{t("about_screen.partners")}</Title>
        <TextSmallBold>{t("about_screen.call_1")}</TextSmallBold>

        <ScrollView
          ref={scrollviewPartners}
          contentContainerStyle={{
            ...stylesheet.logoScrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          {sortedPartners.map((partner, index) => (
            <LogoContainer key={index} isRTL={isRTL}>
              <LogoImage source={{ uri: partner.logo }} resizeMode="contain" />
            </LogoContainer>
          ))}
        </ScrollView>

        <TextSmallNormal>{t("about_screen.call_2")}</TextSmallNormal>
        <RTLView>
          <CustomButton
            i18nKey="about_screen.download_call_button"
            defaultText="Télécharger l’appel [PDF]"
            backgroundColor={styles.colors.black}
            iconName="download-outline"
            textColor={styles.colors.white}
            onPress={() =>
              Linking.openURL("https://refugies.info/AMI_REFUGIE_INFO.pdf")
            }
            notFullWidth={true}
            iconFirst={true}
            style={{
              marginTop: styles.margin * 3,
              marginHorizontal: styles.margin * 3,
            }}
          />
        </RTLView>

        {/* L'ÉQUIPE */}
        <Title style={{ marginBottom: styles.margin * 3 }}>
          {t("about_screen.team")}
        </Title>
        <TeamContainer>
          {membres.map((membre, index) => (
            <TeamItem key={index}>
              <Image source={membre.photo} style={{ width: 80, height: 80 }} />
              <TeamDetails isRTL={isRTL}>
                <View
                  style={{
                    flexShrink: 1,
                    flexDirection: !isRTL ? "row" : "row-reverse",
                  }}
                >
                  <TeamName>{membre.name}</TeamName>
                </View>
                <TeamRole>{membre.roleName}</TeamRole>
              </TeamDetails>
            </TeamItem>
          ))}
        </TeamContainer>
      </Rows>
    </Page>
  );
};
