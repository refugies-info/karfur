import * as React from "react";
import { View, Image } from "react-native";
import * as Linking from "expo-linking";
import {
  TextSmallNormal,
  TextSmallBold,
} from "../../components/StyledText";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-eva-icons";
import { useHeaderAnimation } from "../../hooks/useHeaderAnimation";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ProfileParamList } from "../../../types";
import { HeaderWithBackAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { ContentCard } from "../../components/Profil/PrivacyPolicy/ContentCard";
import { ContentHighlight } from "../../components/Profil/PrivacyPolicy/ContentHighlight";
import { RTLView } from "../../components/BasicComponents";
import AnalyticsLogo from "../../theme/images/privacyPolicy/analytics_logo.svg";
import FirebaseLogo from "../../theme/images/privacyPolicy/firebase_logo.svg";
import YourInformations from "../../theme/images/privacyPolicy/your-informations.png";
import YourData from "../../theme/images/privacyPolicy/your-data.png";
import { P, H1, Link } from "../../components/Profil/Typography";
import { List } from "../../components/Profil/List";
import { ReadingTime } from "../../components/Profil/ReadingTime";
import { UpdatedDate } from "../../components/Profil/UpdatedDate";
import { ContactButton } from "../../components/Profil/ContactButton";

const ContentContainer = styled.ScrollView`
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;

export const PrivacyPolicyScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "PrivacyPolicyScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation();

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { t, isRTL } = useTranslationWithRTL();

  return (
    <View style={{flex: 1}}>
      <HeaderWithBackAnimated
        title={t("profile_screens.privacy_policy")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
        navigation={navigation}
      />

      <ContentContainer
        onScroll={handleScroll}
        scrollEventThrottle={5}
        contentContainerStyle={{
          overflow: "visible",
          paddingHorizontal: theme.margin * 3
        }}
      >
        <P style={{marginTop: theme.margin * 2}}>
          Nous avons créé cette page pour répondre en quelques minutes à toutes les questions que tu te poses sur tes données et comment on s’en sert dans l’application réfugiés.info.
        </P>
        <P>
          Si tu ne trouves pas de réponse à ta question, n’hésite pas à nous la poser directement.
        </P>

        <ReadingTime
          isRTL={isRTL}
          text="5 à 10 minutes"
        />

        <H1>Les informations sur toi</H1>

        <ContentCard
          step={"1"}
          title={"C’est quoi et à quoi ça sert ?"}
        >
          <P>
            Quand tu ouvres l’application réfugiés.info pour la première fois ou quand tu vas dans l’onglet “Moi”, nous te demandons de nous partager quelques informations sur toi, par exemple la ville dans laquelle tu habites.
          </P>
          <Image
            source={YourInformations}
            style={{
              width: 200,
              height: 92,
              alignSelf: "center",
              marginBottom: theme.margin * 3
            }}
          />
          <ContentHighlight>
            <TextSmallNormal>Tu n’es pas obligé de partager ces informations pour avoir accès à l’application.</TextSmallNormal>
          </ContentHighlight>
          <P style={{ marginBottom: 0, marginTop: theme.margin * 3 }}>
            Nous utilisons ces informations comme des filtres, pour te proposer uniquement le contenu qui est le plus adapté à ce que tu recherches.
          </P>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Comment ça marche ?"}
        >
          <P>
            Quand tu ouvres l’application et à tout moment dans l’onglet “Moi”, tu peux décider de nous partager :
          </P>
          <RTLView style={{marginBottom: theme.margin}}>
            <Icon
              name="pin-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                marginRight: !isRTL ? theme.margin : 0,
                marginLeft: isRTL ? theme.margin : 0
               }}
            />
            <TextSmallNormal>la ville dans laquelle tu habites</TextSmallNormal>
          </RTLView>
          <RTLView style={{marginBottom: theme.margin}}>
            <Icon
              name="calendar-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                marginRight: !isRTL ? theme.margin : 0,
                marginLeft: isRTL ? theme.margin : 0
               }}
            />
            <TextSmallNormal>ta tranche d’âge</TextSmallNormal>
          </RTLView>
          <RTLView style={{marginBottom: theme.margin * 3}}>
            <Icon
              name="message-circle-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                marginRight: !isRTL ? theme.margin : 0,
                marginLeft: isRTL ? theme.margin : 0
               }}
            />
            <TextSmallNormal>ton niveau en français</TextSmallNormal>
          </RTLView>
          <P>
            Pour nous indiquer ta ville, tu peux utiliser les fonctionnalités de géolocalisation de ton téléphone ou taper le nom de la ville directement.
          </P>
          <ContentHighlight>
            <TextSmallNormal>
              Si tu utilises la géolocalisation de ton téléphone, cette information pourra être conservée par iOS ou Android. Pense à regarder les paramètres de ton téléphone pour en savoir plus.
            </TextSmallNormal>
          </ContentHighlight>
        </ContentCard>

        <ContentCard
          step={"3"}
          title={"Qui peut avoir accès à ces données ?"}
        >
          <P>
            Seul réfugiés.info peut avoir accès aux données que tu nous partages directement (ta ville, ta tranche d’âge et ton niveau de français).
          </P>
          <P>
            Ces informations et ta sélection de fiches de l’onglet “Mes fiches” sont stockées directement sur ton téléphone.
          </P>
          <P style={{ marginBottom: 0 }}>
            Nous ne vendons jamais ces informations.
          </P>
        </ContentCard>

        <ContentCard
          step={"4"}
          title={"Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?"}
        >
          <P>
            Tu as le droit de changer d’avis sur tes données.
          </P>
          <P style={{ marginBottom: 0 }}>
            Si tu souhaites supprimer ou modifier les données que tu nous a partagées (ta ville, ta tranche d’âge ou ton niveau de français), il suffit de se rendre dans l’onglet “Moi” en bas à droite de l’écran. Tu pourras alors les modifier ou les effacer en cliquant sur le bouton “Supprimer mes informations”.
          </P>
        </ContentCard>

        <H1>Les données sur ta navigation</H1>

        <ContentCard
          step={"1"}
          title={"C’est quoi et à quoi ça sert ?"}
        >
          <P>
            Quand tu navigues dans l’application réfugiés.info, nous récoltons automatiquement des informations sur ta navigation, par exemple combien de temps tu passes sur une de nos fiches.
          </P>
          <Image
            source={YourData}
            style={{
              width: 210,
              height: 130,
              alignSelf: "center",
              marginBottom: theme.margin * 3
            }}
          />
          <P style={{ marginBottom: 0 }}>
            Grâce à ces informations, nous faisons des statistiques pour nous aider à améliorer l’application au fil du temps et à mieux comprendre tes besoins.
          </P>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Comment ça marche ?"}
        >
          <P>
            Quand tu navigues dans l’application, nos sociétés partenaires Firebase et Google Analytics récoltent automatiquement des données qui tracent ton activité sur notre application. Ce sont des traceurs.
          </P>
          <P style={{ marginBottom: 0 }}>
            Nous récupérons ces informations de manière anonyme et compilées. Elles nous permettent de mieux comprendre comment toi et les autres utilisateurs naviguez sur notre application. Elles nous permettent aussi de réaliser des statistiques afin d’améliorer l’application.
          </P>
        </ContentCard>

        <ContentCard
          step={"3"}
          title={"Qui peut avoir accès à ces données ?"}
        >
          <P>
            Pour les données de navigation tracées automatiquement, les sociétés partenaires Firebase et Google Analytics ont accès à ces données, et elles nous les retransmettent ensuite de manière anonymes et compilées pour réaliser des statistiques.
          </P>
          <P>
            Pour comprendre comment et combien de temps ces sociétés conservent tes données de navigation, tu peux aller consulter leurs propres Politiques de Données Personnelles – c’est celles-ci qui s’appliquent.
          </P>
          <ContentHighlight>
            <TextSmallNormal>
              Voici comment ces sociétés partenaires traitent tes données.
            </TextSmallNormal>

            <RTLView style={{ marginVertical: theme.margin * 2 }}>
              <FirebaseLogo
                width={34}
                height={34}
                style={{
                  marginRight: !isRTL ? theme.margin : 0,
                  marginLeft: isRTL ? theme.margin : 0
                }}
              />
              <TextSmallBold>Firebase</TextSmallBold>
            </RTLView>

            <List
              isRTL={isRTL}
              items={[
                "Attribue un numéro à chaque installation de l’application (ce numéro ne permet pas d’identifier l’utilisateur)",
                "Trace des événements dans l’application",
                "Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info",
                "Garde tes données 26 mois",
                <>
                  Politique de données personnelles :{" "}
                  <Link accessibilityRole="link" onPress={() => { Linking.openURL("https://firebase.google.com/support/privacy") }}>ici</Link>
                </>
              ]}
            ></List>

            <RTLView style={{ marginVertical: theme.margin * 2 }}>
              <AnalyticsLogo
                width={32}
                height={32}
                style={{
                  marginRight: !isRTL ? theme.margin : 0,
                  marginLeft: isRTL ? theme.margin : 0,
                  width: 32,
                  height: 32
                }}
              />
              <TextSmallBold>Google Analytics</TextSmallBold>
            </RTLView>

            <List
              isRTL={isRTL}
              items={[
                "Trace des événements dans l’application",
                "Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info",
                "Garde tes données 26 mois",
                <>
                  Politique de données personnelles :{" "}
                  <Link accessibilityRole="link" onPress={() => { Linking.openURL("https://support.google.com/analytics/answer/6004245") }}>ici</Link>
                </>
              ]}
            ></List>
          </ContentHighlight>
        </ContentCard>

        <ContentCard
          step={"4"}
          title={"Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?"}
        >
          <P>
          Si tu ne veux plus que nos sociétés partenaires collectent automatiquement tes données de navigation, tu peux les effacer en désinstallant l’application ou les gérer directement via les paramètres Android ou iOS de ton téléphone.
          </P>
          <P style={{ marginBottom: 0 }}>
            Si tu souhaites réinitialiser l’identifiant anonyme attribué automatiquement par Firebase, tu peux cliquer sur le bouton “Réinitialiser l’application” dans l’onglet “Moi” en bas à droite de ton écran.
          </P>
        </ContentCard>

        <H1>Qui sommes-nous ?</H1>
        <P style={{ marginBottom: 0 }}>
          Nous sommes Réfugiés.info, une plateforme numérique qui propose de l’information simple et traduite sur 12 thématiques de l’intégration.
          Visite la page <Link accessibilityRole="link" onPress={() => { navigation.navigate("AboutScreen") }}>Qui sommes nous ?</Link> pour plus d'informations.
        </P>

        <H1>Il te reste des questions ?</H1>
        <P>N’hésite pas à nous contacter :</P>
        <ContactButton isRTL={isRTL} />

        <UpdatedDate
          isRTL={isRTL}
          text="30 novembre 2021"
        />

      </ContentContainer>

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
