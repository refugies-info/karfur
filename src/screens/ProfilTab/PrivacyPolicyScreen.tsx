import * as React from "react";
import { View, Text, Image, Linking } from "react-native";
import {
  TextBigBold,
  TextSmallNormal,
  TextSmallBold,
} from "../../components/StyledText";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ProfileParamList } from "../../../types";
import { HeaderWithBackAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { ContentCard } from "../../components/Profil/PrivacyPolicy/ContentCard";
import { ContentHighlight } from "../../components/Profil/PrivacyPolicy/ContentHighlight";
import { RTLView } from "../../components/BasicComponents";
import { CustomButton } from "../../components/CustomButton";
import AnalyticsLogo from "../../theme/images/privacyPolicy/analytics_logo.svg";
import FirebaseLogo from "../../theme/images/privacyPolicy/firebase_logo.svg";
import YourInformations from "../../theme/images/privacyPolicy/your-informations.png";
import YourData from "../../theme/images/privacyPolicy/your-data.png";


const ContentContainer = styled.ScrollView`
  padding-horizontal: ${theme.margin * 3}px;
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;
const PText = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin * 3}px;
`;
const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 3}px;
  margin-top: ${theme.margin * 7}px;
`;
const ListItem = styled(TextSmallNormal)`
  margin-right: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin : 0}px;
`;
const Link = styled(TextSmallNormal)`
  text-decoration: underline;
`;
const LinkBold = styled(TextSmallBold)`
  text-decoration: underline;
`;

export const PrivacyPolicyScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "PrivacyPolicyScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { isRTL } = useTranslationWithRTL();

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
    <View style={{flex: 1}}>
      <HeaderWithBackAnimated
        title="Tes données, pour quoi faire ?"
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
        navigation={navigation}
      />

      <ContentContainer
        onScroll={handleScroll}
        scrollEventThrottle={5}
      >
        <PText style={{marginTop: theme.margin * 2}}>
          Nous avons créé cette page pour répondre en quelques minutes à toutes les questions que tu te poses sur tes données et comment on s’en sert dans l’application réfugiés.info.
        </PText>
        <PText>
          Si tu ne trouves pas de réponse à ta question, n’hésite pas à nous la poser directement.
        </PText>

        <RTLView>
          <Icon
            name="clock-outline"
            height={24}
            width={24}
            fill={theme.colors.darkGrey}
            style={{
              marginRight: !isRTL ? theme.margin : 0,
              marginLeft: isRTL ? theme.margin : 0
            }}
          />
          <TextSmallNormal style={{color: theme.colors.darkGrey}}>
            Temps de lecture : <Text style={{color: theme.colors.green}}>5 à 10 minutes</Text>
          </TextSmallNormal>
        </RTLView>

        <Title>Les informations sur toi</Title>

        <ContentCard
          step={"1"}
          title={"C’est quoi et à quoi ça sert ?"}
        >
          <PText>
            Quand tu ouvres l’application réfugiés.info pour la première fois ou quand tu vas dans l’onglet “Moi”, nous te demandons de nous partager quelques informations sur toi, par exemple la ville dans laquelle tu habites.
          </PText>
          <Image
            source={YourInformations}
            style={{
              width: 200,
              height: 92,
              alignSelf: "center",
              marginBottom: theme.margin * 3
            }}
            width={200}
            height={92}
          />
          <ContentHighlight>
            <TextSmallNormal>Tu n’es pas obligé de partager ces informations pour avoir accès à l’application.</TextSmallNormal>
          </ContentHighlight>
          <PText style={{ marginBottom: 0, marginTop: theme.margin * 3 }}>
            Nous utilisons ces informations comme des filtres, pour te proposer uniquement le contenu qui est le plus adapté à ce que tu recherches.
          </PText>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Comment ça marche ?"}
        >
          <PText>
            Quand tu ouvres l’application et à tout moment dans l’onglet “Moi”, tu peux décider de nous partager :
          </PText>
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
          <PText>
            Pour nous indiquer ta ville, tu peux utiliser les fonctionnalités de géolocalisation de ton téléphone ou taper le nom de la ville directement.
          </PText>
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
          <PText>
            Seul réfugiés.info peut avoir accès aux données que tu nous partages directement (ta ville, ta tranche d’âge et ton niveau de français).
          </PText>
          <PText>
            Ces informations et ta sélection de fiches de l’onglet “Mes fiches” sont stockées directement sur ton téléphone.
          </PText>
          <PText style={{ marginBottom: 0 }}>
            Nous ne vendons jamais ces informations.
          </PText>
        </ContentCard>

        <ContentCard
          step={"4"}
          title={"Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?"}
        >
          <PText>
            Tu as le droit de changer d’avis sur tes données.
          </PText>
          <PText style={{ marginBottom: 0 }}>
            Si tu souhaites supprimer ou modifier les données que tu nous a partagées (ta ville, ta tranche d’âge ou ton niveau de français), il suffit de se rendre dans l’onglet “Moi” en bas à droite de l’écran. Tu pourras alors les modifier ou les effacer en cliquant sur le bouton “Supprimer mes informations”.
          </PText>
        </ContentCard>

        <Title>Les données sur ta navigation</Title>

        <ContentCard
          step={"1"}
          title={"C’est quoi et à quoi ça sert ?"}
        >
          <PText>
            Quand tu navigues dans l’application réfugiés.info, nous récoltons automatiquement des informations sur ta navigation, par exemple combien de temps tu passes sur une de nos fiches.
          </PText>
          <Image
            source={YourData}
            style={{
              width: 210,
              height: 130,
              alignSelf: "center",
              marginBottom: theme.margin * 3
            }}
            width={210}
            height={130}
          />
          <PText style={{ marginBottom: 0 }}>
            Grâce à ces informations, nous faisons des statistiques pour nous aider à améliorer l’application au fil du temps et à mieux comprendre tes besoins.
          </PText>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Comment ça marche ?"}
        >
          <PText>
            Quand tu navigues dans l’application, nos sociétés partenaires Firebase et Google Analytics récoltent automatiquement des données qui tracent ton activité sur notre application. Ce sont des traceurs.
          </PText>
          <PText style={{ marginBottom: 0 }}>
            Nous récupérons ces informations de manière anonyme et compilées. Elles nous permettent de mieux comprendre comment toi et les autres utilisateurs naviguez sur notre application. Elles nous permettent aussi de réaliser des statistiques afin d’améliorer l’application.
          </PText>
        </ContentCard>

        <ContentCard
          step={"3"}
          title={"Qui peut avoir accès à ces données ?"}
        >
          <PText>
            Pour les données de navigation tracées automatiquement, les sociétés partenaires Firebase et Google Analytics ont accès à ces données, et elles nous les retransmettent ensuite de manière anonymes et compilées pour réaliser des statistiques.
          </PText>
          <PText>
            Pour comprendre comment et combien de temps ces sociétés conservent tes données de navigation, tu peux aller consulter leurs propres Politiques de Données Personnelles – c’est celles-ci qui s’appliquent.
          </PText>
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

            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Attribue un numéro à chaque installation de l’application (ce numéro ne permet pas d’identifier l’utilisateur)
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Trace des événements dans l’application
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Garde tes données 26 mois
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Politique de données personnelles :{" "}
                <Link accessibilityRole="link" onPress={() => { Linking.openURL("https://firebase.google.com/support/privacy") }}>ici</Link>
              </ListItem>
            </RTLView>


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
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Trace des événements dans l’application
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Garde tes données 26 mois
              </ListItem>
            </RTLView>
            <RTLView style={{ alignItems: "flex-start"}}>
              <TextSmallNormal>{"\u2022"}</TextSmallNormal>
              <ListItem>
                Politique de données personnelles :{" "}
                <Link accessibilityRole="link" onPress={() => { Linking.openURL("https://support.google.com/analytics/answer/6004245") }}>ici</Link>
              </ListItem>
            </RTLView>



          </ContentHighlight>
        </ContentCard>

        <ContentCard
          step={"4"}
          title={"Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?"}
        >
          <PText>
          Si tu ne veux plus que nos sociétés partenaires collectent automatiquement tes données de navigation, tu peux les effacer en désinstallant l’application ou les gérer directement via les paramètres Android ou iOS de ton téléphone.
          </PText>
          <PText style={{ marginBottom: 0 }}>
            Si tu souhaites réinitialiser l’identifiant anonyme attribué automatiquement par Firebase, tu peux cliquer sur le bouton “Réinitialiser l’application” dans l’onglet “Moi” en bas à droite de ton écran.
          </PText>
        </ContentCard>

        <Title>Qui sommes-nous ?</Title>
        <PText style={{ marginBottom: 0 }}>
          Nous sommes Réfugiés.info, une plateforme numérique qui propose de l’information simple et traduite sur 12 thématiques de l’intégration.
          Visite la page <LinkBold accessibilityRole="link" onPress={() => { }}>Qui sommes nous ?</LinkBold> pour plus d'informations.
        </PText>

        <Title>Il te reste des questions ?</Title>
        <PText>
          N’hésite pas à nous contacter :
        </PText>

        <View
          style={{
            alignItems: !isRTL ? "flex-start" : "flex-end"
          }}
        >
          <CustomButton
            i18nKey={"contact@refugies.info"}
            defaultText="contact@refugies.info"
            iconName="email-outline"
            backgroundColor={theme.colors.black}
            textColor={theme.colors.white}
            onPress={() => {Linking.openURL("mailto://contact@refugies.info")}}
            iconFirst={true}
            notFullWidth={true}
          />
        </View>

        <RTLView style={{marginVertical: theme.margin * 7 }}>
          <Icon
            name="refresh-outline"
            height={24}
            width={24}
            fill={theme.colors.darkGrey}
            style={{
              marginRight: !isRTL ? theme.margin : 0,
              marginLeft: isRTL ? theme.margin : 0
            }}
          />
          <TextSmallNormal style={{color: theme.colors.darkGrey}}>
            Mise à jour : <Text style={{color: theme.colors.green}}>30 novembre</Text>
          </TextSmallNormal>
        </RTLView>

      </ContentContainer>

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
