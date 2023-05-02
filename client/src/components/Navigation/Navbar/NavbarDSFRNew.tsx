/* import { Header } from "@codegouvfr/react-dsfr/Header";
import { logoRI } from "assets/figma";
import { BackendNavigation } from "containers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getPath } from "routes";
import styled from "styled-components";
import FrontendNavigation from "./FrontendNavigation";
import { UserToolItem, SpeekToolItem, SubscribeToolItem, TranslationToolItem } from "./NavbarItems";

const LogoImage = styled(Image)`
  max-width: 80%;
`;

const useSpeekToolItem = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ttsActive = useSelector(ttsActiveSelector);
  const ttsLoading = useSelector(ttsLoadingSelector);
  const enabled = !isMobile && hasTTSAvailable.includes((router.locale || "fr") as AvailableLanguageI18nCode);
  const toggleAudio = () => dispatch(toggleTTSActionCreator());
  const isEditionMode = useEditionMode();

  if (!enabled) return null;

  return {
    buttonProps: {
      className: cls(ttsActive && styles.speek_tool_item_active),
      onClick: !isEditionMode ? toggleAudio : undefined,
    },
    linkProps: { href: "#" },
    iconId: ttsLoading ? "ri-loader-2-line" : "ri-play-circle-line",
    text: t("Écouter", "Écouter"),
  };

  // return (
  //   <span id="speek-tool-item">
  //     <ToolItem
  //       className={cls(ttsActive && styles.speek_tool_item_active)}
  //       icon={ttsLoading ? "ri-loader-2-line" : "ri-play-circle-line"}
  //       onClick={!isEditionMode ? toggleAudio : undefined}
  //     >
  //       {t("Écouter", "Écouter")}
  //     </ToolItem>

  //     {isEditionMode && (
  //       <Tooltip target="speek-tool-item" placement="bottom">
  //         L'écoute du site est désactivée lorsque vous rédigez une fiche.
  //       </Tooltip>
  //     )}
  //   </span>
  // );
};

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const speekItem = useSpeekToolItem();

  const quickAccessItems = [
    {
      iconId: "fr-icon-lock-line",
      linkProps: {
        href: "#",
      },
      text: "Se connecter",
    },
    {
      iconId: "fr-icon-account-line",
      linkProps: {
        href: "#",
      },
      text: "S’enregistrer",
    },
  ];
  if (speekItem) quickAccessItems.push(speekItem);

  return (
    <Header
      brandTop="GOUVERNEMENT"
      homeLinkProps={{
        href: "/",
        title: "Accueil - Réfugiés.info - République Française",
      }}
      operatorLogo={{
        alt: "Réfugiés.info",
        imgUrl: "/image/logoRI.svg",
        orientation: "horizontal",
      }}
      quickAccessItems={quickAccessItems}
    />
  );
};

export default Navbar;
 */

const Navbar = () => <></>;
export default Navbar;
