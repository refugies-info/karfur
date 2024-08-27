import { StackScreenProps } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { Image } from "react-native";
import { useTheme } from "styled-components/native";
import { Badge, ButtonDSFR, Callout, Page, Separator, Spacer } from "~/components";
import { SeparatorSpacing } from "~/components/layout/Separator/Separator";
import { ContactButton } from "~/components/Profil/ContactButton";
import { IconList } from "~/components/Profil/IconList";
import { List } from "~/components/Profil/List";
import { H1, H2, P } from "~/components/Profil/Typography";
import { TextDSFR_MD, TextDSFR_MD_Bold } from "~/components/StyledText";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import YourInformations from "~/theme/images/privacyPolicy/screenshots.png";
import YourData from "~/theme/images/privacyPolicy/statistics.png";
import { ProfileParamList } from "~/types/navigation";

export const PrivacyPolicyScreen = ({ navigation }: StackScreenProps<ProfileParamList, "PrivacyPolicyScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <Page
      headerTitle={t("profile_screens.privacy_policy")}
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
      headerIconName="lock-outline"
    >
      <H1>{t("profile_screens.privacy_policy")}</H1>
      <P>
        Nous avons créé cette page pour répondre en quelques minutes à toutes les questions que tu te poses sur tes
        données et comment on s’en sert dans l’application réfugiés.info.
      </P>
      <P>Si tu ne trouves pas de réponse à ta question, n’hésite pas à nous la poser directement.</P>
      <Badge text="Temps de lecture : 5 à 10 minutes" type="new" icon="clock" />

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />
      <H1 blue>Les informations sur toi</H1>

      <H2>C’est quoi et à quoi ça sert ?</H2>
      <P>
        Quand tu ouvres l’application réfugiés.info pour la première fois ou quand tu vas dans l’onglet “Moi”, nous te
        demandons de nous partager quelques informations sur toi, par exemple la ville dans laquelle tu habites.
      </P>
      <Image
        source={YourInformations}
        style={{
          width: 280,
          height: 209,
          alignSelf: "center",
        }}
      />
      <Callout>
        <TextDSFR_MD>Tu n’es pas obligé de partager ces informations pour avoir accès à l’application.</TextDSFR_MD>
      </Callout>
      <P style={{ marginBottom: theme.margin * 5, marginTop: styles.margin * 1 }}>
        Nous utilisons ces informations comme des filtres, pour te proposer uniquement le contenu qui est le plus adapté
        à ce que tu recherches.
      </P>

      <H2>Comment ça marche ?</H2>
      <P>Quand tu ouvres l’application et à tout moment dans l’onglet “Moi”, tu peux décider de nous partager :</P>
      <IconList
        items={[
          { icon: "pin-outline", text: "Ta ville" },
          { icon: "calendar-outline", text: "Ton âge" },
          { icon: "message-circle-outline", text: "Ton niveau en français" },
        ]}
      />
      <P style={{ marginBottom: theme.margin }}>
        Pour nous indiquer ta ville, tu peux utiliser les fonctionnalités de géolocalisation de ton téléphone ou taper
        le nom de la ville directement.
      </P>
      <Callout>
        <TextDSFR_MD>
          Si tu utilises la géolocalisation de ton téléphone, cette information pourra être conservée par iOS ou
          Android. Pense à regarder les paramètres de ton téléphone pour en savoir plus.
        </TextDSFR_MD>
      </Callout>
      <Spacer height={theme.margin * 2} />

      <H2>Qui peut avoir accès à ces données ?</H2>
      <P>
        Seul réfugiés.info peut avoir accès aux données que tu nous partages directement (ta ville, ta tranche d’âge et
        ton niveau de français).
      </P>
      <P>
        Ces informations et ta sélection de fiches de l’onglet “Mes fiches” sont stockées directement sur ton téléphone.
      </P>
      <P style={{ marginBottom: theme.margin * 5 }}>Nous ne vendons jamais ces informations.</P>

      <H2>Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?</H2>
      <P>Tu as le droit de changer d’avis sur tes données.</P>
      <P style={{ marginBottom: 0 }}>
        Si tu souhaites supprimer ou modifier les données que tu nous a partagées (ta ville, ta tranche d’âge ou ton
        niveau de français), il suffit de se rendre dans l’onglet “Moi” en bas à droite de l’écran. Tu pourras alors les
        modifier ou les effacer en cliquant sur le bouton “Supprimer mes informations”.
      </P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Les données sur ta navigation</H1>

      <H2>C’est quoi et à quoi ça sert ?</H2>
      <P style={{ marginBottom: theme.margin * 2 }}>
        Quand tu navigues dans l’application réfugiés.info, nous récoltons automatiquement des informations sur ta
        navigation, par exemple combien de temps tu passes sur une de nos fiches.
      </P>
      <Image
        source={YourData}
        style={{
          width: 327,
          height: 253,
          alignSelf: "center",
        }}
      />
      <P style={{ marginBottom: theme.margin * 5 }}>
        Grâce à ces informations, nous faisons des statistiques pour nous aider à améliorer l’application au fil du
        temps et à mieux comprendre tes besoins.
      </P>

      <H2>Comment ça marche ?</H2>
      <P>
        Quand tu navigues dans l’application, nos sociétés partenaires Firebase et Google Analytics récoltent
        automatiquement des données qui tracent ton activité sur notre application. Ce sont des traceurs.
      </P>
      <P style={{ marginBottom: theme.margin * 5 }}>
        Nous récupérons ces informations de manière anonyme et compilées. Elles nous permettent de mieux comprendre
        comment toi et les autres utilisateurs naviguez sur notre application. Elles nous permettent aussi de réaliser
        des statistiques afin d’améliorer l’application.
      </P>

      <H2>Qui peut avoir accès à ces données ?</H2>
      <P>
        Pour les données de navigation tracées automatiquement, les sociétés partenaires Firebase et Google Analytics
        ont accès à ces données, et elles nous les retransmettent ensuite de manière anonymes et compilées pour réaliser
        des statistiques.
      </P>
      <P>
        Pour comprendre comment et combien de temps ces sociétés conservent tes données de navigation, tu peux aller
        consulter leurs propres Politiques de Données Personnelles – c’est celles-ci qui s’appliquent.
      </P>

      <TextDSFR_MD>Voici comment ces sociétés partenaires traitent tes données.</TextDSFR_MD>

      <TextDSFR_MD_Bold style={{ marginVertical: theme.margin * 2 }}>Firebase</TextDSFR_MD_Bold>

      <List
        isRTL={isRTL}
        items={[
          "Attribue un numéro à chaque installation de l’application (ce numéro ne permet pas d’identifier l’utilisateur)",
          "Trace des événements dans l’application",
          "Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info",
          "Garde tes données 26 mois",
        ]}
      ></List>
      <ButtonDSFR
        onPress={() => {
          Linking.openURL("https://firebase.google.com/support/privacy");
        }}
        title="Politique de données personnelles"
        accessibilityLabel="Politique de données personnelles"
        priority="tertiary"
        size="medium"
        externalLink
        style={{ marginTop: theme.margin * 2 }}
      />

      <TextDSFR_MD_Bold style={{ marginVertical: theme.margin * 2 }}>Google Analytics</TextDSFR_MD_Bold>

      <List
        isRTL={isRTL}
        items={[
          "Trace des événements dans l’application",
          "Agrège ces événements pour nous fournir des statistiques servant à améliorer l’application Réfugiés.info",
          "Garde tes données 26 mois",
        ]}
      ></List>

      <ButtonDSFR
        onPress={() => {
          Linking.openURL("https://support.google.com/analytics/answer/6004245");
        }}
        title="Politique de données personnelles"
        accessibilityLabel="Politique de données personnelles"
        priority="tertiary"
        size="medium"
        externalLink
        style={{ marginTop: theme.margin * 2 }}
      />

      <Spacer height={theme.margin * 5} />

      <H2>Comment faire si tu n’es pas d’accord avec l’utilisation de tes données ?</H2>
      <P>
        Si tu ne veux plus que nos sociétés partenaires collectent automatiquement tes données de navigation, tu peux
        les effacer en désinstallant l’application ou les gérer directement via les paramètres Android ou iOS de ton
        téléphone.
      </P>
      <P style={{ marginBottom: 0 }}>
        Si tu souhaites réinitialiser l’identifiant anonyme attribué automatiquement par Firebase, tu peux cliquer sur
        le bouton “Réinitialiser l’application” dans l’onglet “Moi” en bas à droite de ton écran.
      </P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Il te reste des questions ?</H1>
      <P>N’hésite pas à nous contacter :</P>
      <ContactButton isRTL={isRTL} />
      <Spacer height={theme.margin * 5} />

      <Badge text="Mise à jour le 30 novembre 2021" type="info" />
      <Spacer height={theme.margin * 5} />
    </Page>
  );
};
