import * as React from "react";
import { View } from "react-native";
import {
  TextSmallNormal,
} from "../../components/StyledText";
import { Icon } from "react-native-eva-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useHeaderAnimation } from "../../hooks/useHeaderAnimation";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { ProfileParamList } from "../../../types";
import { HeaderWithBackAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { RTLView } from "../../components/BasicComponents";
import { ContentCard } from "../../components/Profil/PrivacyPolicy/ContentCard";
import { ContentHighlight } from "../../components/Profil/PrivacyPolicy/ContentHighlight";
import { P, H1, Link } from "../../components/Profil/Typography";
import { List } from "../../components/Profil/List";
import { ReadingTime } from "../../components/Profil/ReadingTime";
import { UpdatedDate } from "../../components/Profil/UpdatedDate";
import { ContactButton } from "../../components/Profil/ContactButton";

const ContentContainer = styled.ScrollView`
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;

export const LegalNoticeScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "LegalNoticeScreen">) => {
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

        <P style={{marginTop: theme.margin * 2}}>
          Sur cette page, tu trouveras toutes les informations obligatoires sur l’application Réfugiés.info. Par exemple : Qui est notre hébergeur ? Qui détient les droits d’auteur sur les contenus que nous publions ?
        </P>

        <ReadingTime
          isRTL={isRTL}
          text="5 à 10 minutes"
        />

        <H1>Qui est l’éditeur de Réfugiés.info ?</H1>
        <P style={{marginBottom: theme.margin}}>
          L’application Réfugiés.info a été créée par la Délégation interministérielle à l'accueil et à l'intégration des réfugiés du Ministère de l’Intérieur.
        </P>
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

        <P style={{marginTop: theme.margin * 3, marginBottom: theme.margin}}>
          Elle est développée par la MedNum, société coopérative d’intérêt collectif spécialisée sur la médiation et l’inclusion numérique.
        </P>
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

        <P style={{marginTop: theme.margin * 3 }}>
          Monsieur Nour ALLAZKANI, est le responsable de publication de l’application.
        </P>

        <H1>Qui héberge Réfugiés.info ?</H1>
        <P style={{marginBottom: theme.margin}}>
          L’application Réfugiés.info est hébergée par la société Google Cloud.
        </P>
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

        <P style={{marginTop: theme.margin * 3 }}>
          Les serveurs qui hébergent l’application sont situés en Europe.
        </P>

        <H1>Quels sont les droits sur les contenus ?</H1>

        <ContentCard
          step={"1"}
          title={"Les contenus"}
        >
          <P style={{ marginBottom: 0 }}>
            Les informations que l’on trouve sur l’application Réfugiés.info sont publiques et peuvent être reproduites ou réutilisées librement, à condition de :
          </P>
          <List
            isRTL={isRTL}
            items={[
              "respecter l’intégrité de l’information reproduite",
              "citer la source « Réfugiés.info »"
            ]}
          ></List>

          <RTLView style={{ marginVertical: theme.margin * 4 }}>
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
            <TextSmallNormal style={{ flexShrink: 1 }}>(Art. L. 122-5 du Code de la propriété intellectuelle)</TextSmallNormal>
          </RTLView>

          <ContentHighlight>
            <P>
              Tu ne peux pas utiliser ces informations dans un but publicitaire ou commercial.
            </P>
            <P style={{marginBottom: 0}}>
              Tu ne peux pas non plus utiliser le contenu de l’application en le détournant de son contexte d’actualité, ou de manière contraire aux lois et aux règlements, ou d’une façon qui porte atteinte à l’ordre public.
            </P>
          </ContentHighlight>
        </ContentCard>

        <ContentCard
          step={"2"}
          title={"Les créations graphiques"}
        >
          <P>Toute reproduction ou adaptation (retouchage, montage, recadrage...) des éléments graphiques et iconographiques du site est interdite sans l’accord de Réfugiés.info.</P>
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
            <TextSmallNormal style={{ flexShrink: 1 }}>(Art L.122-4 du Code de la propriété Intellectuelle)</TextSmallNormal>
          </RTLView>
          <P>Pour toute question sur la reproduction de contenus, tu peux t’adresser à :</P>
          <ContactButton isRTL={isRTL} />
        </ContentCard>

        <H1>Création de liens vers Réfugiés.info</H1>
        <P>Tu peux librement créer des liens vers Réfugiés.info sans accord préalable. En revanche, la mention explicite de l’intitulé de l’application dans l’intitulé du lien est vivement souhaitée.</P>
        <P>Il est fortement recommandé que l’ouverture de cette page se fasse dans une fenêtre indépendante du navigateur.</P>
        <P>Toutefois, Réfugiés.info se réserve le droit de demander la suppression de liens vers des sites dont l’objet s’avérerait non conforme à l’objet de l’application, diffuseraient des informations à caractère raciste, pornographique, xénophobe ou étant de nature à heurter la sensibilité du public.</P>

        <H1>Liens vers d’autres sites</H1>
        <P>Des liens vers d’autres sites, publics ou privés sont proposés sur l’application pour te faciliter l’accès à l’information. Réfugiés.info n’est pas responsable du contenu de ces sites.</P>

        <H1>Accès au site</H1>
        <P>Réfugiés.info et son hébergeur font le maximum pour te permettre d’avoir accès en continu à l’application Réfugiés.info.</P>
        <P>Il est possible que certaines situations (panne, intention technique de maintenance) empêchent l’accès à l’application. Réfugiés.info a le droit de ne pas garantir l’accessibilité sans que sa responsabilité ne soit engagée.</P>

        <H1>Il te reste des questions ?</H1>
        <P>Si tu ne trouves pas l’information que tu cherches, n’hésite pas à consulter les autres pages de l’application :</P>

        <List
          isRTL={isRTL}
          items={[
            <>
              <Link
                accessibilityRole="link"
                onPress={() => { navigation.navigate("PrivacyPolicyScreen") }}
              >
                Tes données, pour quoi faire
              </Link> qui répond à toutes tes questions sur tes données dans l’application.
            </>
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>
        <List
          isRTL={isRTL}
          items={[
            <>
              <Link
                accessibilityRole="link"
                onPress={() => { navigation.navigate("AboutScreen") }}
              >
                Qui sommes-nous ?
              </Link> qui t’en dit plus sur notre plateforme numérique Réfugiés.info.
            </>
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>

        <P>Sinon, n’hésite pas à nous contacter directement :</P>
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
