import * as React from "react";
import { Platform, Image, View } from "react-native";
import * as Linking from "expo-linking";
import { StackScreenProps } from "@react-navigation/stack";
import styled, { useTheme } from "styled-components/native";
import { TextDSFR_MD, TextDSFR_MD_Bold } from "../../components/StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { styles } from "../../theme";
import { ProfileParamList } from "../../../types";
import { RTLView } from "../../components/BasicComponents";
import { List } from "../../components/Profil/List";
import { P, H1, H2, Link } from "../../components/Profil/Typography";
import IosIllu from "../../theme/images/accessibility/accessibility-ios.png";
import AndroidIllu from "../../theme/images/accessibility/accessibility-android.png";
import NotApplicable from "../../theme/images/accessibility/not-applicable.svg";
import { ContactButton } from "../../components/Profil/ContactButton";
import { Badge, Page, Separator, Spacer } from "../../components";
import { SeparatorSpacing } from "../../components/layout/Separator/Separator";
import { Info } from "../../components/Profil/Info";

const Dots = () => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      alignSelf: "flex-end",
      marginBottom: 4,
    }}
  >
    {Array.from({ length: 100 }, (_, index) => (
      <View
        key={index}
        style={{
          width: 1,
          height: 1,
          backgroundColor: "black",
          borderRadius: 100,
          marginLeft: 2,
        }}
      ></View>
    ))}
  </View>
);

const Legend = styled.View<{ color: string }>`
  width: ${({ theme }) => theme.margin * 3}px;
  height: ${({ theme }) => theme.margin * 3}px;
  margin-right: ${({ theme }) => (!theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
  background-color: ${(props: { color: string }) => props.color};
  border: 1px solid ${({ theme }) => theme.colors.dsfr_dark};
`;

const Card = styled.View`
  border: 1px solid ${({ theme }) => theme.colors.dsfr_borderGrey};
  background-color: white;
  padding: ${({ theme }) => theme.margin * 3}px;
  margin-bottom: 0;
`;

export const AccessibilityScreen = ({}: StackScreenProps<
  ProfileParamList,
  "AccessibilityScreen"
>) => {
  const { isRTL } = useTranslationWithRTL();
  const theme = useTheme();
  const isIOS = Platform.OS === "ios";

  return (
    <Page
      headerTitle="Accessibilité"
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
      headerIconName="file-text-outline"
    >
      <H1>L'accessibilité, c'est quoi ?</H1>
      <P>
        Sur cette page, tu trouveras les informations obligatoires concernant
        l’accessibilité de l’application {isIOS ? "iOS" : "Android"}{" "}
        Réfugiés.info.
      </P>
      <P>
        L’accessibilité permet à tous les publics, sans discrimination,
        d’accéder aux contenus et aux services numériques. Pour cela, il faut
        respecter des règles émises par le World Wide Web Consortium et pensées
        par des ergonomes pour chaque type de handicap.
      </P>

      <Badge text="Temps de lecture : 5 à 10 minutes" type="new" icon="clock" />
      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Déclaration d’accessibilité</H1>
      <P>
        La Délégation interministérielle à l'accueil et à l'intégration des
        réfugiés s'engage à rendre son application mobile accessible
        conformément à la Directive européenne sur l'accessibilité des
        applications Web et mobiles (Directive (UE) 2018/2048) sur les exigences
        d'accessibilité pour les produits et services TIC EN 301 549 V3.2.1.
      </P>
      <P>
        À cette fin, il met en œuvre la stratégie et les actions détaillées dans
        son plan pluriannuel en cours d'élaboration.
      </P>
      <P style={{ marginBottom: 0 }}>
        Cette déclaration d'accessibilité s'applique à l'application mobile{" "}
        {isIOS ? "iOS" : "Android"} Réfugiés.info.
      </P>

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>État de conformité</H1>
      <P style={{ marginBottom: 0 }}>
        L’application {isIOS ? "iOS" : "Android"} Réfugiés.info est{" "}
        {isIOS ? (
          <>
            en <TextDSFR_MD_Bold>conformité partielle</TextDSFR_MD_Bold>
          </>
        ) : (
          <TextDSFR_MD_Bold>non-conforme</TextDSFR_MD_Bold>
        )}{" "}
        avec EN 301 549 V3.2.1 en raison des non-conformités et des dérogations
        énumérées ci-dessous.
      </P>

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Résultats des tests</H1>
      <P>
        L’audit de conformité réalisé par la société{" "}
        <Link
          accessibilityRole="link"
          onPress={() => {
            Linking.openURL("https://www.ipedis.com/");
          }}
        >
          Ipedis
        </Link>{" "}
        révèle que {isIOS ? "50,00" : "45,83"}% des critères de la Directive EN
        301 549 V3.2.1 sont respectés.
      </P>

      <Card>
        <P style={{ fontStyle: "italic", textAlign: "center" }}>
          Résultat de conformité des critères au EN-301-549-V3.2.1
        </P>
        <Image
          source={isIOS ? IosIllu : AndroidIllu}
          resizeMode="contain"
          style={{
            width: 228,
            height: 232,
            alignSelf: "center",
            marginBottom: styles.margin * 3,
          }}
          alt="24 critères"
        />
        <RTLView
          style={{
            alignItems: "center",
            marginBottom: styles.margin,
          }}
        >
          <Legend color={styles.colors.dsfr_success} />
          <TextDSFR_MD>Critères conformes</TextDSFR_MD>
          <Dots />
          <TextDSFR_MD_Bold>{isIOS ? "12" : "11"}</TextDSFR_MD_Bold>
        </RTLView>

        <RTLView
          style={{
            alignItems: "center",
            marginBottom: styles.margin,
          }}
        >
          <Legend color={styles.colors.dsfr_error} />
          <TextDSFR_MD>Critères non conformes</TextDSFR_MD>
          <Dots />
          <TextDSFR_MD_Bold>{isIOS ? "12" : "13"}</TextDSFR_MD_Bold>
        </RTLView>
        <RTLView
          style={{
            alignItems: "center",
            marginBottom: styles.margin,
          }}
        >
          <NotApplicable
            width={24}
            height={24}
            style={{ marginRight: theme.margin * 2 }}
          />
          <TextDSFR_MD>Critères non applicables</TextDSFR_MD>
          <Dots />
          <TextDSFR_MD_Bold>19</TextDSFR_MD_Bold>
        </RTLView>
      </Card>

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Contenus non accessibles</H1>
      <P>
        Les contenus listés ci-dessous ne sont pas accessibles pour les raisons
        suivantes.
      </P>

      <H2>Non-conformité</H2>
      <P>
        Plusieurs éléments de non-conformité sont décrits dans ce document, dont
        certains récurrents sur plusieurs pages :
      </P>

      <List
        isRTL={isRTL}
        items={[
          isIOS
            ? "Les images/icônes porteuses d'information n'ont pas d'alternative textuelle"
            : null,
          "Certains textes ne sont pas correctement lus par le lecteur d'écran",
          isIOS
            ? "Le contraste entre la couleur de fond et les textes/images et certains composants d’interface ne sont pas suffisants"
            : null,
          "L'application n'est consultable qu'en version portrait",
          !isIOS
            ? "L'augmentation de la taille du texte par défaut n'est pas toujours répétée dans toute l'application"
            : null,
          !isIOS
            ? "Certains boutons nécessitent d'appuyer deux fois et maintenir enfoncer pour être sélectionné"
            : null,
          "L'ordre de tabulation des éléments de la page n'est pas toujours logique et intuitif",
          "Au chargement des pages, le focus ne part pas automatiquement sur le premier élément de la nouvelle page",
          "Des pièges au clavier sont présents",
          "Certains boutons n'ont pas d'intitulé ou ont un intitulé qui n'est pas pertinent",
          "Le label des champs est visible, mais n'est pas restitué lorsque le focus du lecteur d’écran arrive dessus",
          "Certaines pages ont des titres qui ne sont pas définis comme étant des en-têtes",
          "La navigation sur la carte Google doit se faire avec l’utilisation simultanée de deux doigts ou plus",
          "Le champ Ta Ville affiche une liste de suggestion, mais cela n'est pas vocalisé par le lecteur d'écran",
          "Les barres d'onglet ne sont pas reconnues comme telles par le lecteur d'écran",
          !isIOS
            ? "Certains textes sont lus comme des éléments interactifs par le lecteur d'écran alors qu'ils n'ont pas de fonctionnalité"
            : null,
          "Certains boutons/listes de suggestion/boutons radio/liens ne sont pas reconnus comme tels",
          "Les messages de statut ne sont pas restitués par le lecteur d'écran",
        ]}
        style={{ marginBottom: styles.margin * 3 }}
      ></List>

      <H2>Dérogations pour charge disproportionnée</H2>
      <P>Pas de dérogation identifiée</P>

      <H2>Contenus non soumis à l’obligation d’accessibilité</H2>
      <P style={{ marginBottom: 0 }}>
        Pas de contenus non soumis à l'obligation d'accessibilité
      </P>

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Établissement de cette déclaration d’accessibilité</H1>
      <P>Cette déclaration a été établie le 30 novembre 2021.</P>
      <P>Technologies utilisées pour la réalisation de l’application :</P>
      <List
        isRTL={isRTL}
        items={["React Native"]}
        style={{ marginBottom: styles.margin * 3 }}
      ></List>

      <P>
        Les tests des pages web ont été effectués avec les combinaisons d'agents
        utilisateurs et de lecteurs d’écran suivants :
      </P>
      <List
        isRTL={isRTL}
        items={[isIOS ? "iOS Voiceover" : "Android Talkback"]}
        style={{ marginBottom: styles.margin * 3 }}
      ></List>

      <P>Les outils suivants ont été utilisés lors de l’évaluation :</P>
      <List
        isRTL={isRTL}
        items={[
          "Contrast Color checker WCAG",
          isIOS ? "iOS Voiceover" : "Android Talkback",
        ]}
        style={{ marginBottom: styles.margin * 3 }}
      ></List>

      <P style={{ marginBottom: 0 }}>
        Pages du site ayant fait l’objet de la vérification de conformité :
      </P>
      <List
        isRTL={isRTL}
        items={[
          "Page “Explorer”",
          "Page “Déclaration d’accessibilité”",
          "Page “Rechercher”",
          "Page du Choix de langue",
          "Carrousel d'explications de l'application",
          "Pages de création des filtres",
          "Page “Moi”",
          "Page “Mes fiches”",
          "Fiche “Trouver un logement”",
          "Fiche “Accueils de jours à Paris”",
          "Page “Mentions légales”",
        ]}
      ></List>

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Retour d’information et contact</H1>
      <P>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous
        pouvez contacter le responsable de l’application mobile pour être
        orienté vers une alternative accessible ou obtenir le contenu sous une
        autre forme.
      </P>
      <ContactButton isRTL={isRTL} />

      <Separator
        spacing={SeparatorSpacing.XLarge}
        fullWidth
        color={theme.colors.dsfr_purple}
      />

      <H1 blue>Voies de recours</H1>
      <P>Cette procédure est à utiliser dans le cas suivant :</P>
      <P>
        Vous avez signalé au responsable du site internet un défaut
        d’accessibilité qui vous empêche d’accéder à un contenu ou à un des
        services du portail et vous n’avez pas obtenu de réponse satisfaisante.
      </P>
      <List
        isRTL={isRTL}
        items={[
          <>
            Écrire un message au{" "}
            <Link
              accessibilityRole="link"
              onPress={() => {
                Linking.openURL("https://formulaire.defenseurdesdroits.fr/");
              }}
            >
              Défenseur des droits
            </Link>
          </>,
          <>
            Contacter le délégué du{" "}
            <Link
              accessibilityRole="link"
              onPress={() => {
                Linking.openURL(
                  "https://www.defenseurdesdroits.fr/saisir/delegues"
                );
              }}
            >
              Défenseur des droits de ta région
            </Link>
          </>,
          "Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à l’adresse suivante :",
        ]}
      ></List>
      <Spacer height={theme.margin * 2} />
      <Info
        icon="pin-outline"
        text={"Défenseur des droits\nLibre réponse 71120\n75342 Paris CEDEX 07"}
      />

      <Spacer height={theme.margin * 5} />

      <Badge text="Mise à jour le 6 janvier 2022" type="info" />
      <Spacer height={theme.margin * 5} />
    </Page>
  );
};
