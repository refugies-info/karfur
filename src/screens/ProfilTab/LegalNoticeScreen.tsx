import * as React from "react";
import { View, Text } from "react-native";
import * as Linking from "expo-linking";
import {
  TextSmallNormal,
  TextBigBold,
  TextSmallBold
} from "../../components/StyledText";
import { Icon } from "react-native-eva-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ProfileParamList } from "../../../types";
import { HeaderWithBackAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { RTLView } from "../../components/BasicComponents";
import { ContentCard } from "../../components/Profil/PrivacyPolicy/ContentCard";
import { ContentHighlight } from "../../components/Profil/PrivacyPolicy/ContentHighlight";
import { CustomButton } from "../../components/CustomButton";

const ContentContainer = styled.ScrollView`
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
  props.isRTL ? theme.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin : 0}px;
`;
const Link = styled(TextSmallBold)`
  text-decoration: underline;
`;

export const LegalNoticeScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "LegalNoticeScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { t, isRTL } = useTranslationWithRTL();

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
        title={t("profile_screens.legal_notice")}
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

        <PText style={{marginTop: theme.margin * 2}}>
          Sur cette page, tu trouveras toutes les informations obligatoires sur l’application Réfugiés.info. Par exemple : Qui est notre hébergeur ? Qui détient les droits d’auteur sur les contenus que nous publions ?
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

        <Title>Qui est l’éditeur de Réfugiés.info ?</Title>
        <PText style={{marginBottom: theme.margin}}>
          L’application Réfugiés.info a été créée par la Délégation interministérielle à l'accueil et à l'intégration des réfugiés du Ministère de l’Intérieur.
        </PText>
        <RTLView>
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
          <TextSmallNormal>Place Beauvau, 75800 Paris Cedex 08</TextSmallNormal>
        </RTLView>

        <PText style={{marginTop: theme.margin * 3, marginBottom: theme.margin}}>
          Elle est développée par la MedNum, société coopérative d’intérêt collectif spécialisée sur la médiation et l’inclusion numérique.
        </PText>
        <RTLView>
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
          <TextSmallNormal>135 Boulevard Chanzy, 93100 Montreuil</TextSmallNormal>
        </RTLView>

        <PText style={{marginTop: theme.margin * 3 }}>
          Monsieur Nour ALLAZKANI, est le responsable de publication de l’application.
        </PText>

        <Title>Qui héberge Réfugiés.info ?</Title>
        <PText style={{marginBottom: theme.margin}}>
          L’application Réfugiés.info est hébergée par la société Google Cloud.
        </PText>
        <RTLView>
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
          <TextSmallNormal>8 rue de Londres, 75009 PARIS</TextSmallNormal>
        </RTLView>

        <PText style={{marginTop: theme.margin * 3 }}>
          Les serveurs qui hébergent l’application sont situés en Europe.
        </PText>

        <Title>Quels sont les droits sur les contenus ?</Title>

        <ContentCard
          step={"1"}
          title={"Les contenus"}
        >
          <PText style={{ marginBottom: 0 }}>
            Les informations que l’on trouve sur l’application Réfugiés.info sont publiques et peuvent être reproduites ou réutilisées librement, à condition de :
          </PText>
          <RTLView style={{ alignItems: "flex-start" }}>
            <TextSmallNormal>{"\u2022"}</TextSmallNormal>
            <ListItem isRTL={isRTL}>
              respecter l’intégrité de l’information reproduite
            </ListItem>
          </RTLView>
          <RTLView style={{ alignItems: "flex-start" }}>
            <TextSmallNormal>{"\u2022"}</TextSmallNormal>
            <ListItem isRTL={isRTL}>
              citer la source « Réfugiés.info »
            </ListItem>
          </RTLView>

          <RTLView style={{marginVertical: theme.margin * 4}}>
            <Icon
              name="book-open-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                marginRight: !isRTL ? theme.margin : 0,
                marginLeft: isRTL ? theme.margin : 0
              }}
            />
            <TextSmallNormal>(Art. L. 122-5 du Code de la propriété intellectuelle)</TextSmallNormal>
          </RTLView>

          <ContentHighlight>
            <PText>
              Tu ne peux pas utiliser ces informations dans un but publicitaire ou commercial.
            </PText>
            <PText style={{marginBottom: 0}}>
              Tu ne peux pas non plus utiliser le contenu de l’application en le détournant de son contexte d’actualité, ou de manière contraire aux lois et aux règlements, ou d’une façon qui porte atteinte à l’ordre public.
            </PText>
          </ContentHighlight>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Les créations graphiques"}
        >
          <PText>Toute reproduction ou adaptation (retouchage, montage, recadrage...) des éléments graphiques et iconographiques du site est interdite sans l’accord de Réfugiés.info.</PText>
          <RTLView style={{marginBottom: theme.margin * 3}}>
            <Icon
              name="book-open-outline"
              height={24}
              width={24}
              fill={theme.colors.black}
              style={{
                marginRight: !isRTL ? theme.margin : 0,
                marginLeft: isRTL ? theme.margin : 0
                }}
            />
            <TextSmallNormal>(Art L.122-4 du Code de la propriété Intellectuelle)</TextSmallNormal>
          </RTLView>
          <PText>Pour toute question sur la reproduction de contenus, tu peux t’adresser à :</PText>
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
        </ContentCard>

        <Title>Création de liens vers Réfugiés.info</Title>
        <PText>Tu peux librement créer des liens vers Réfugiés.info sans accord préalable. En revanche, la mention explicite de l’intitulé de l’application dans l’intitulé du lien est vivement souhaitée.</PText>
        <PText>Il est fortement recommandé que l’ouverture de cette page se fasse dans une fenêtre indépendante du navigateur.</PText>
        <PText>Toutefois, Réfugiés.info se réserve le droit de demander la suppression de liens vers des sites dont l’objet s’avérerait non conforme à l’objet de l’application, diffuseraient des informations à caractère raciste, pornographique, xénophobe ou étant de nature à heurter la sensibilité du public.</PText>

        <Title>Liens vers d’autres sites</Title>
        <PText>Des liens vers d’autres sites, publics ou privés sont proposés sur l’application pour te faciliter l’accès à l’information. Réfugiés.info n’est pas responsable du contenu de ces sites.</PText>

        <Title>Accès au site</Title>
        <PText>Réfugiés.info et son hébergeur font le maximum pour te permettre d’avoir accès en continu à l’application Réfugiés.info.</PText>
        <PText>Il est possible que certaines situations (panne, intention technique de maintenance) empêchent l’accès à l’application. Réfugiés.info a le droit de ne pas garantir l’accessibilité sans que sa responsabilité ne soit engagée.</PText>

        <Title>Il te reste des questions ?</Title>
        <PText>Si tu ne trouves pas l’information que tu cherches, n’hésite pas à consulter les autres pages de l’application :</PText>

        <RTLView style={{ alignItems: "flex-start", marginBottom: theme.margin * 3}}>
          <TextSmallNormal>{"\u2022"}</TextSmallNormal>
          <ListItem isRTL={isRTL}>
          <Link
            accessibilityRole="link" 
            onPress={() => { navigation.navigate("PrivacyPolicyScreen") }}
          >
            Tes données, pour quoi faire
          </Link> qui répond à toutes tes questions sur tes données dans l’application.
          </ListItem>
        </RTLView>
        <RTLView style={{ alignItems: "flex-start", marginBottom: theme.margin * 3}}>
          <TextSmallNormal>{"\u2022"}</TextSmallNormal>
          <ListItem isRTL={isRTL}>
          <Link
            accessibilityRole="link" 
            onPress={() => { navigation.navigate("AboutScreen") }}
          >
            Qui sommes-nous ?
          </Link> qui t’en dit plus sur notre plateforme numérique Réfugiés.info.
          </ListItem>
        </RTLView>

        <PText>Sinon, n’hésite pas à nous contacter directement :</PText>
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
