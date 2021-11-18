import * as React from "react";
import { View, Linking, ScrollView, StyleSheet, Image } from "react-native";
import {
  TextBigBold,
  TextNormal,
  TextSmallNormal,
  TextNormalBold,
  TextSmallBold,
} from "../../components/StyledText";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ProfileParamList, BottomTabParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { initHorizontalScroll } from "../../libs/rtlHorizontalScroll";
import { HeaderWithBackAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
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

const CARD_WIDTH = 280;
const LOGO_WIDTH = 104;
const LOGO_HEIGHT = 80;

const ContentContainer = styled.ScrollView`
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;
const Card = styled.View`
  width: ${CARD_WIDTH}px;
  padding: ${theme.margin * 2}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 4;
`;
const CardImage = styled.Image`
  width: 248px;
  height: 176px;
  align-self: center;
  margin-bottom: ${theme.margin * 2}px;
`;
const CardTitle = styled(TextNormalBold)`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin * 2}px;
`;
const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin * 7}px;
  margin-horizontal: ${theme.margin * 3}px;
`;
const LogoContainer = styled.View`
  padding: ${theme.margin * 2}px;
  margin-right: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin * 3 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin * 3 : 0}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
`;
const LogoImage = styled.Image`
  width: ${LOGO_WIDTH}px;
  height: ${LOGO_HEIGHT}px;
`;
const TeamContainer = styled.ScrollView`
  padding-horizontal: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
`;
const TeamItem = styled(RTLView)`
  padding: ${theme.margin * 2}px;
  border-width: 2px;
  border-color: ${theme.colors.benevolat100};
  background-color: ${theme.colors.benevolat30};
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${theme.margin * 2}px;
`;
const TeamDetails = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin * 3 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin * 3 : 0}px;
  flex-shrink: 1;
  flex-grow: 0;
`;
const TeamName = styled(TextSmallBold)`
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.margin}px;
  padding: ${theme.margin / 2}px;
  width: auto;
`;
const TeamRole = styled(TextSmallNormal)`
  flex-wrap: wrap;
`;

const styles = StyleSheet.create({
  scrollview: {
    paddingHorizontal: theme.margin * 3,
    paddingTop: theme.margin * 2,
    paddingBottom: theme.margin,
    marginBottom: theme.margin
  },
  logoScrollview: {
    paddingHorizontal: theme.margin * 3,
    paddingTop: theme.margin * 2,
    paddingBottom: theme.margin,
    marginBottom: theme.margin
  },
});

const sortPartners = () =>
  partners.sort((a, b) => {
    if (a.date === b.date) return 0;
    if (a.date > b.date) return 1;
    return -1;
  });

type AboutScreenType = CompositeNavigationProp<
  //@ts-ignore
  StackScreenProps<ProfileParamList, "AboutScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

export const AboutScreen = ({ navigation }: AboutScreenType) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const scrollviewMissions = React.useRef<ScrollView>(null);
  const scrollviewProblematiques = React.useRef<ScrollView>(null);
  const scrollviewContributif = React.useRef<ScrollView>(null);
  const scrollviewPartners = React.useRef<ScrollView>(null);

  const sortedPartners = sortPartners();

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { t, isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    initHorizontalScroll([
      scrollviewMissions,
      scrollviewProblematiques,
      scrollviewContributif,
      scrollviewPartners
    ], isRTL)
  }, [isRTL])

  // Header animation
  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);
  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 5 && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 5 && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderWithBackAnimated
        title={t("QuiSommesNous.Qui sommes-nous")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
        navigation={navigation}
      />

      <ContentContainer
        onScroll={handleScroll}
        scrollEventThrottle={5}
      >
        <TextNormal style={{ marginHorizontal: theme.margin * 3 }}>
          {t("QuiSommesNous.subheader1")} {t("QuiSommesNous.subheader2")}
        </TextNormal>

        {/* MISSIONS */}
        <Title>{t("QuiSommesNous.Missions")}</Title>
        <ScrollView
          ref={scrollviewMissions}
          contentContainerStyle={{
            ...styles.scrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0,
            justifyContent: "space-between"
          }}>
            <CardImage
              source={Mission1}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.Mission_3_header")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.Mission_3_subheader")}</TextSmallNormal>
          </Card>
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0,
            justifyContent: "space-between"
          }}>
            <CardImage
              source={Mission2}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.Mission_2_header")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.Mission_2_subheader")}</TextSmallNormal>
          </Card>
          <Card>
            <CardImage
              source={Mission3}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.Mission_1_header")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.Mission_1_subheader")}</TextSmallNormal>
          </Card>
        </ScrollView>

        {/* PROBLEMATIQUES */}
        <Title>{t("QuiSommesNous.Problématiques")}</Title>
        <ScrollView
          ref={scrollviewProblematiques}
          contentContainerStyle={{
            ...styles.scrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0
          }}>
            <CardImage
              source={Problematique1}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.problem_1_header")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.problem_1_subheader")}</TextSmallNormal>
          </Card>
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0
          }}>
            <CardImage
              source={Problematique2}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.problem_2_header")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.problem_2_subheader")}</TextSmallNormal>
          </Card>
          <Card>
            <CardImage
              source={Problematique3}
              width={248}
              height={176}
              />
            <CardTitle>{t("QuiSommesNous.problem_3_header2")}</CardTitle>
            <TextSmallNormal>{t("QuiSommesNous.problem_3_subheader2")}</TextSmallNormal>
          </Card>
        </ScrollView>

        {/* CONTRIBUTIF */}
        <Title>{t("QuiSommesNous.Approche contributive")}</Title>
        <ScrollView
          ref={scrollviewContributif}
          contentContainerStyle={{
            ...styles.scrollview,
            paddingBottom: theme.margin * 4,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0,
            justifyContent: "space-between"
          }}>
            <View>
              <CardImage
                source={Contributif1}
                width={248}
                height={176}
                />
              <CardTitle>{t("QuiSommesNous.contributive_1_header2")}</CardTitle>
              <TextSmallNormal>{t("QuiSommesNous.contributive_1_subheader")}</TextSmallNormal>
            </View>
          </Card>
          <Card style={{
            marginRight: !isRTL ? theme.margin * 3 : 0,
            marginLeft: isRTL ? theme.margin * 3 : 0,
            justifyContent: "space-between"
          }}>
            <View>
              <CardImage
                source={Contributif2}
                width={248}
                height={176}
                />
              <CardTitle>{t("QuiSommesNous.contributive_2_header")}</CardTitle>
              <TextSmallNormal>{t("QuiSommesNous.contributive_2_subheader")}</TextSmallNormal>
            </View>
          </Card>
          <Card style={{ justifyContent: "space-between" }}>
            <View>
              <CardImage
                source={Contributif3}
                width={248}
                height={176}
                />
              <CardTitle>{t("QuiSommesNous.contributive_3_header")}</CardTitle>
              <TextSmallNormal>{t("QuiSommesNous.contributive_3_subheader")}</TextSmallNormal>
            </View>
          </Card>
        </ScrollView>

        {/* PARTENAIRES */}
        <Title style={{ marginBottom: theme.margin * 3 }}>
          {t("QuiSommesNous.Partenaires")}
        </Title>
        <TextSmallBold style={{ marginHorizontal: theme.margin * 3 }}>
          {t("QuiSommesNous.appel-a-manifestation1")}
        </TextSmallBold>

        <ScrollView
          ref={scrollviewPartners}
          contentContainerStyle={{
            ...styles.logoScrollview,
            flexDirection: !isRTL ? "row" : "row-reverse",
          }}
          horizontal={true}
        >
        {sortedPartners.map((partner, index) => (
          <LogoContainer key={index} isRTL={isRTL}>
            <LogoImage
              source={{ uri: partner.logo }}
              resizeMode="contain"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
            />
          </LogoContainer>
        ))}
        </ScrollView>

        <TextSmallNormal style={{ marginHorizontal: theme.margin * 3 }}>
          {t("QuiSommesNous.appel-a-manifestation2")}
        </TextSmallNormal>
        <RTLView>
          <CustomButton
            i18nKey={"QuiSommesNous.telechargerAppel"}
            defaultText="Télécharger l’appel [PDF]"
            backgroundColor={theme.colors.black}
            iconName="download-outline"
            textColor={theme.colors.white}
            onPress={( ) => Linking.openURL("https://refugies.info/AMI_REFUGIE_INFO.pdf")}
            notFullWidth={true}
            iconFirst={true}
            style={{marginTop: theme.margin * 3, marginHorizontal: theme.margin * 3}}
          />
        </RTLView>

        {/* L'ÉQUIPE */}
        <Title style={{ marginBottom: theme.margin * 3 }}>
          {t("QuiSommesNous.L'équipe")}
        </Title>
        <TeamContainer>
          {membres.map((membre, index) => (
            <TeamItem key={index}>
              <Image
                source={membre.photo}
                width={80}
                height={80}
                style={{ width: 80, height: 80 }}
              />
              <TeamDetails isRTL={isRTL}>
                <View style={{
                  flexShrink: 1,
                  flexDirection: !isRTL ? "row" : "row-reverse"
                }}>
                  <TeamName>{membre.name}</TeamName>
                </View>
                <TeamRole>{membre.roleName}</TeamRole>
              </TeamDetails>
            </TeamItem>
          ))}
        </TeamContainer>
      </ContentContainer>

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
