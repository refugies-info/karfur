import * as React from "react";
import { View, Text } from "react-native";
import * as Linking from "expo-linking";
import {
  TextSmallNormal,
  TextBigBold,
  TextSmallBold,
  TextNormalBold,
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
import { List } from "../../components/Profil/List";
import { CustomButton } from "../../components/CustomButton";
import { Card } from "../../components/Profil/Card";
import IosIllu from "../../theme/images/accessibility/accessibility-ios.svg"

const ContentContainer = styled.ScrollView`
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;
const P = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin * 3}px;
`;
const H1 = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 3}px;
  margin-top: ${theme.margin * 7}px;
`;
const H2 = styled(TextNormalBold)`
  margin-bottom: ${theme.margin * 3}px;
`;
const Link = styled(TextSmallBold)`
  text-decoration: underline;
`;
const Legend = styled.View`
  width: ${theme.margin * 3}px;
  height: ${theme.margin * 3}px;
  margin-right: ${(props: { isRTL: boolean }) =>
  !props.isRTL ? theme.margin * 2 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
  props.isRTL ? theme.margin * 2 : 0}px;
  background-color: ${(props: { color: string }) => props.color};
  border-radius: ${theme.radius}px;
`;

export const AccessibilityScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "AccessibilityScreen">) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation();

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { isRTL } = useTranslationWithRTL();

  return (
    <View style={{flex: 1}}>
      <HeaderWithBackAnimated
        title="L’accessibilité, c’est quoi ?"
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
          Sur cette page, tu trouveras les informations obligatoires concernant l’accessibilité de l’application iOS Réfugiés.info.
        </P>
        <P>
          L’accessibilité permet à tous les publics, sans discrimination, d’accéder aux contenus et aux services numériques. Pour cela, il faut respecter des règles émises par le World Wide Web Consortium et pensées par des ergonomes pour chaque type de handicap.
        </P>

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
            Temps de lecture : <Text style={{color: theme.colors.green}}>5 à 10 minutes</Text>
          </TextSmallNormal>
        </RTLView>

        <H1>Déclaration d’accessibilité</H1>
        <P>
          La Délégation interministérielle à l'accueil et à l'intégration des réfugiés du Ministère de l’Intérieur s'engage à rendre son application mobile accessible conformément à la Directive européenne sur l'accessibilité des applications Web et mobiles (Directive (UE) 2018/2048) sur les exigences d'accessibilité pour les produits et services TIC EN 301 549 V3.2.1.
        </P>
        <P>
          À cette fin, il met en œuvre la stratégie et les actions détaillées dans son plan pluriannuel en cours d'élaboration.
        </P>
        <P style={{marginBottom: 0}}>
          Cette déclaration d'accessibilité s'applique à l'application mobile iOS Réfugiés.info.
        </P>

        <H1>État de conformité</H1>
        <P style={{marginBottom: 0}}>L’application iOS Réfugiés.info est en <TextSmallBold>conformité partielle</TextSmallBold> avec EN 301 549 V3.2.1 en raison des non-conformités et des dérogations énumérées ci-dessous.</P>

        <H1>Résultats des tests</H1>
        <P>
          L’audit de conformité réalisé par la société{" "}
          <Link
            accessibilityRole="link"
            onPress={() => { Linking.openURL("https://www.ipedis.com/") }}
          >Ipedis</Link>
          {" "}révèle que 50,00% des critères de la Directive EN 301 549 V3.2.1 sont respectés.
        </P>
        <RTLView style={{ alignItems: "flex-start", marginBottom: theme.margin}}>
          <TextSmallNormal>  ✅  </TextSmallNormal>
          <TextSmallNormal>12 critères sont respectés</TextSmallNormal>
        </RTLView>
        <RTLView style={{ alignItems: "flex-start", marginBottom: theme.margin}}>
          <TextSmallNormal>  ❌  </TextSmallNormal>
          <TextSmallNormal>12 critères ne sont pas respectés</TextSmallNormal>
        </RTLView>
        <RTLView style={{ alignItems: "flex-start", marginBottom: theme.margin * 3}}>
          <TextSmallNormal>  🚫  </TextSmallNormal>
          <TextSmallNormal>19 critères ne sont pas applicables</TextSmallNormal>
        </RTLView>

        <Card style={{marginBottom: 0}}>
          <P style={{ fontStyle: "italic", textAlign: "center" }}>Résultat de conformité des critères au EN-301-549-V3.2.1</P>
          <IosIllu
            width={230}
            height={210}
            style={{ alignSelf: "center", marginBottom: theme.margin * 3 }}
          />
          <RTLView style={{ alignItems: "center", justifyContent: "center", marginBottom: theme.margin}}>
            <Legend isRTL={isRTL} color={theme.colors.travail80} />
            <TextSmallNormal style={{ width: 180 }}>critères conformes</TextSmallNormal>
          </RTLView>
          <RTLView style={{ alignItems: "center", justifyContent: "center", marginBottom: theme.margin}}>
            <Legend isRTL={isRTL} color={theme.colors.sante80} />
            <TextSmallNormal style={{ width: 180 }}>critères non conformes</TextSmallNormal>
          </RTLView>
        </Card>

        <H1>Contenus non accessibles</H1>
        <P>Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.</P>

        <H2>Non-conformité</H2>
        <P>Plusieurs éléments de non-conformité sont décrits dans ce document, dont certains récurrents sur plusieurs pages :</P>

        <List
          isRTL={isRTL}
          items={[
            "Les images/icônes porteuses d'information n'ont pas d'alternative textuelle",
            "Certains textes ne sont pas correctement lus par le lecteur d'écran",
            "Le contraste entre la couleur de fond et les textes/images et certains composants d’interface ne sont pas suffisants",
            "L'application n'est consultable qu'en version portrait",
            "L'ordre de tabulation des éléments de la page n'est pas toujours logique et intuitif",
            "Au chargement des pages, le focus ne part pas automatiquement sur le premier élément de la nouvelle page",
            "Des pièges au clavier sont présents",
            "Certains boutons n'ont pas d'intitulé ou ont un intitulé qui n'est pas pertinent",
            "Le label des champs est visible, mais n'est pas restitué lorsque le focus du lecteur d’écran arrive dessus",
            "Certaines pages ont des titres qui ne sont pas définis comme étant des en-têtes",
            "La navigation sur la carte Google doit se faire avec l’utilisation simultanée de deux doigts ou plus",
            "Le champ Ta Ville affiche une liste de suggestion, mais cela n'est pas vocalisé par le lecteur d'écran",
            "Certains boutons/listes de suggestion/boutons radio/liens ne sont pas reconnus comme tels",
            "Les barres d'onglet ne sont pas reconnues comme telles par le lecteur d'écran",
            "Les messages de statut ne sont pas restitués par le lecteur d'écran"
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>

        <H2>Dérogations pour charge disproportionnée</H2>
        <P>Pas de dérogation identifiée</P>

        <H2>Contenus non soumis à l’obligation d’accessibilité</H2>
        <P style={{marginBottom: 0}}>Pas de contenus non soumis à l'obligation d'accessibilité</P>

        <H1>Établissement de cette déclaration d’accessibilité</H1>
        <P>Cette déclaration a été établie le 30 novembre 2021.</P>
        <P style={{marginBottom: 0}}>Technologies utilisées pour la réalisation de l’application :</P>
        <List
          isRTL={isRTL}
          items={[
            "React Native"
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>

        <P style={{marginBottom: 0}}>Les tests des pages web ont été effectués avec les combinaisons d'agents utilisateurs et de lecteurs d’écran suivants :</P>
        <List
          isRTL={isRTL}
          items={[
            "iOS Voiceover"
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>

        <P style={{marginBottom: 0}}>Les outils suivants ont été utilisés lors de l’évaluation :</P>
        <List
          isRTL={isRTL}
          items={[
            "Contrast Color checker WCAG",
            "iOS Voiceover"
          ]}
          style={{marginBottom: theme.margin * 3}}
        ></List>

        <P style={{marginBottom: 0}}>Pages du site ayant fait l’objet de la vérification de conformité :</P>
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

        <H1>Retour d’information et contact</H1>
        <P>Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de l’application mobile pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.</P>
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

        <H1>Voies de recours</H1>
        <P>Cette procédure est à utiliser dans le cas suivant :</P>
        <P>Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse satisfaisante.</P>
        <List
          isRTL={isRTL}
          items={[
            (<>
              Écrire un message au{" "}
              <Link
                accessibilityRole="link"
                onPress={() => { Linking.openURL("https://formulaire.defenseurdesdroits.fr/") }}
              >Défenseur des droits</Link>
            </>),
            (<>
              Contacter le délégué du{" "}
              <Link
                accessibilityRole="link"
                onPress={() => { Linking.openURL("https://www.defenseurdesdroits.fr/saisir/delegues") }}
              >Défenseur des droits de ta région</Link>
            </>),
            "Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à l’adresse suivante :",
            ]}
        ></List>
        <RTLView style={{ marginTop: theme.margin * 3 }}>
          <Icon
            name="pin-outline"
            height={24}
            width={24}
            fill={theme.colors.black}
            style={{
              marginRight: !isRTL ? theme.margin : theme.margin * 2,
              marginLeft: isRTL ? theme.margin : theme.margin * 2
            }}
          />
          <TextSmallNormal>
            Défenseur des droits{"\n"}
            Libre réponse 71120{"\n"}
            75342 Paris CEDEX 07
          </TextSmallNormal>
        </RTLView>

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
            Mise à jour : <Text style={{color: theme.colors.green}}>6 janvier 2022</Text>
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
