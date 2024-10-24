import { StackScreenProps } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { Badge, Callout, Page, Separator, Spacer } from "~/components";
import { SeparatorSpacing } from "~/components/layout/Separator/Separator";
import { ContactButton } from "~/components/Profil/ContactButton";
import { IconList } from "~/components/Profil/IconList";
import { Info } from "~/components/Profil/Info";
import { List } from "~/components/Profil/List";
import { H1, H2, P } from "~/components/Profil/Typography";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { ProfileParamList } from "~/types/navigation";

export const LegalNoticeScreen = ({ navigation }: StackScreenProps<ProfileParamList, "LegalNoticeScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <Page
      headerTitle={t("profile_screens.legal_notice")}
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
      headerIconName="file-text-outline"
    >
      <H1>{t("profile_screens.legal_notice")}</H1>

      <P>
        Sur cette page, tu trouveras toutes les informations obligatoires sur l’application Réfugiés.info. Par exemple :
        Qui est notre hébergeur ? Qui détient les droits d’auteur sur les contenus que nous publions ?
      </P>

      <Badge text="Temps de lecture : 5 à 10 minutes" type="new" icon="clock" />
      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Qui est l’éditeur de Réfugiés.info ?</H1>
      <P>
        L’application Réfugiés.info a été créée par la Délégation interministérielle à l'accueil et à l'intégration des
        réfugiés du Ministère de l’Intérieur.
      </P>
      <Info icon="pin-outline" text="Place Beauvau, 75800 Paris Cedex 08" />

      <P>
        Elle est développée par la MedNum, société coopérative d’intérêt collectif spécialisée sur la médiation et
        l’inclusion numérique.
      </P>
      <Info icon="pin-outline" text="135 Boulevard Chanzy, 93100 Montreuil" />

      <P style={{ marginBottom: 0 }}>Monsieur Yannick Prost est le responsable de publication de l'application.</P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Qui héberge Réfugiés.info ?</H1>
      <P>L’application Réfugiés.info est hébergée par la société Google Cloud.</P>
      <Info icon="pin-outline" text="8 rue de Londres, 75009 PARIS" />

      <P style={{ marginBottom: 0 }}>Les serveurs qui hébergent l’application sont situés en Europe.</P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Quels sont les droits sur les contenus ?</H1>

      <H2>Les contenus</H2>
      <P>
        Les informations que l’on trouve sur l’application Réfugiés.info sont publiques et peuvent être reproduites ou
        réutilisées librement, à condition de :
      </P>
      <List
        isRTL={isRTL}
        items={["respecter l’intégrité de l’information reproduite", "citer la source « Réfugiés.info »"]}
      ></List>

      <Info icon="book-open-outline" text="(Art. L. 122-5 du Code de la propriété intellectuelle)" />

      <Callout>
        <P>Tu ne peux pas utiliser ces informations dans un but publicitaire ou commercial.</P>
        <P style={{ marginBottom: 0 }}>
          Tu ne peux pas non plus utiliser le contenu de l’application en le détournant de son contexte d’actualité, ou
          de manière contraire aux lois et aux règlements, ou d’une façon qui porte atteinte à l’ordre public.
        </P>
      </Callout>

      <Spacer height={theme.margin * 3} />

      <H2>Les créations graphiques</H2>
      <P>
        Toute reproduction ou adaptation (retouchage, montage, recadrage...) des éléments graphiques et iconographiques
        du site est interdite sans l’accord de Réfugiés.info.
      </P>
      <Info icon="book-open-outline" text="(Art L.122-4 du Code de la propriété Intellectuelle)" />
      <P>Pour toute question sur la reproduction de contenus, tu peux t’adresser à :</P>
      <ContactButton isRTL={isRTL} />

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Création de liens vers Réfugiés.info</H1>
      <P>
        Tu peux librement créer des liens vers Réfugiés.info sans accord préalable. En revanche, la mention explicite de
        l’intitulé de l’application dans l’intitulé du lien est vivement souhaitée.
      </P>
      <P>
        Il est fortement recommandé que l’ouverture de cette page se fasse dans une fenêtre indépendante du navigateur.
      </P>
      <P style={{ marginBottom: 0 }}>
        Toutefois, Réfugiés.info se réserve le droit de demander la suppression de liens vers des sites dont l’objet
        s’avérerait non conforme à l’objet de l’application, diffuseraient des informations à caractère raciste,
        pornographique, xénophobe ou étant de nature à heurter la sensibilité du public.
      </P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Liens vers d’autres sites</H1>
      <P style={{ marginBottom: 0 }}>
        Des liens vers d’autres sites, publics ou privés sont proposés sur l’application pour te faciliter l’accès à
        l’information. Réfugiés.info n’est pas responsable du contenu de ces sites.
      </P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Accès au site</H1>
      <P>
        Réfugiés.info et son hébergeur font le maximum pour te permettre d’avoir accès en continu à l’application
        Réfugiés.info.
      </P>
      <P>
        Il est possible que certaines situations (panne, intention technique de maintenance) empêchent l’accès à
        l’application. Réfugiés.info a le droit de ne pas garantir l’accessibilité sans que sa responsabilité ne soit
        engagée.
      </P>

      <Separator spacing={SeparatorSpacing.XLarge} fullWidth color={theme.colors.dsfr_purple} />

      <H1 blue>Il te reste des questions ?</H1>
      <P>
        Si tu ne trouves pas l’information que tu cherches, n’hésite pas à consulter les autres pages de l’application :
      </P>

      <IconList
        title="Autres pages utiles"
        items={[
          {
            icon: "question-mark-circle-outline",
            text: "Qui sommes-nous ?",
            path: "AboutScreen",
          },
          {
            icon: "lock-outline",
            text: "Tes données",
            path: "PrivacyPolicyScreen",
          },
        ]}
      />

      <P>Sinon, n’hésite pas à nous contacter directement :</P>
      <ContactButton isRTL={isRTL} />
      <Spacer height={theme.margin * 5} />

      <Badge text="Mise à jour le 30 novembre 2021" type="info" />
      <Spacer height={theme.margin * 5} />
    </Page>
  );
};
