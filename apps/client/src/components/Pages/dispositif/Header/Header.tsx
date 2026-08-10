import Button from "@codegouvfr/react-dsfr/Button";
import type { Picture, Sponsor } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import "moment/locale/fa";
import "moment/locale/fr";
import "moment/locale/ru";
import "moment/locale/uk";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LanguageMenu from "~/components/Navigation/Navbar/QuickAccessMenu/LanguageMenu";
import { SponsorsEdit } from "~/components/Pages/dispositif/Edition";
import SaveBookmark from "~/components/Pages/dispositif/SaveBookmark";
import SectionButtons from "~/components/Pages/dispositif/SectionButtons";
import Sponsors from "~/components/Pages/dispositif/Sponsors";
import Image from "~/components/UI/Image";
import { useLocale } from "~/hooks";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import Title from "../Title";

interface Props {
  typeContenu: string;
}

const Header = (props: Props) => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const { isMobile } = useWindowSize();
  const [navigatorShareSupported, setNavigatorShareSupported] = useState(false);

  // Check for Web Share API support when component mounts
  useEffect(() => {
    if (navigator.share !== undefined && typeof navigator.share === "function") {
      setNavigatorShareSupported(true);
    }
  }, []);

  // hide sponsor if it's the default sponsor
  const hideSponsor = dispositif?.mainSponsor?._id === "5f69cb9c0aab6900460c0f3f";

  /**
   * Logo de la structure porteuse.
   *
   * Les fiches créées hors RI (webhook) n'ont pas de `mainSponsor` : leur
   * structure est embarquée dans `sponsors[0]`, dont le logo est une simple URL
   * et non un objet `Picture`. On ne bascule sur ce repli qu'en l'absence totale
   * de `mainSponsor`, pour ne jamais afficher le logo d'un simple partenaire à la
   * place de celui de la structure porteuse.
   */
  const structureLogo = useMemo(() => {
    if (dispositif?.mainSponsor) return dispositif.mainSponsor.picture?.secure_url;

    const logo = (dispositif?.sponsors?.[0] as Sponsor | undefined)?.logo as
      | Picture
      | string
      | null
      | undefined;
    return typeof logo === "string" ? logo : logo?.secure_url;
  }, [dispositif]);

  let vocalizationContent = "";

  if (isMobile) {
    vocalizationContent = dispositif?.titreInformatif || "";
  } else if (dispositif?.titreInformatif) {
    vocalizationContent = dispositif.titreInformatif + (dispositif?.what || "");
  } else {
    vocalizationContent = dispositif?.what || "";
  }

  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);
  const isEditMode = useMemo(() => pageContext.mode === "edit", [pageContext.mode]);
  const isTranslateMode = useMemo(() => pageContext.mode === "translate", [pageContext.mode]);

  const handleShare = () => {
    if (navigatorShareSupported) {
      navigator.share({
        title: dispositif?.titreInformatif || "",
        text: dispositif?.titreMarque
          ? `${dispositif.titreInformatif} - ${dispositif.titreMarque}`
          : dispositif?.titreInformatif,
        url: window.location.href,
      });
      Event("DISPO_VIEW", "share", dispositif?._id?.toString() || "");
    }
  };

  return (
    <header className="relative">
      {isViewMode && (
        <SectionButtons
          className="max-sm:mt-4 max-sm:mb-8 lg:absolute lg:-top-10 lg:ltr:-right-8 lg:rtl:-left-8"
          id="titreInformatif"
          content={vocalizationContent}
        />
      )}
      <Title />

      {!isEditMode && dispositif?.titreMarque && (
        <p>
          {t("Dispositif.with")} {dispositif.titreMarque}
        </p>
      )}

      {!isTranslateMode && (
        <div className="flex items-center gap-3 text-sm">
          {structureLogo && (
            <span className="border-default-grey relative inline-grid aspect-square h-14 w-14 items-center justify-center border p-1">
              <Image src={structureLogo} width={150} height={150} alt="" />
            </span>
          )}

          <span className="flex flex-col gap-1">
            {isEditMode ? (
              <SponsorsEdit />
            ) : (
              <Sponsors sponsors={dispositif?.sponsors} mainSponsor={dispositif?.mainSponsor} />
            )}
            {isViewMode && dispositif?.date && (
              <span className="text-mention-grey">{`${t("Dispositif.updated")} ${moment(dispositif.date).fromNow()}`}</span>
            )}
          </span>
        </div>
      )}

      {isViewMode && (
        <div className="border-default-grey my-8 flex items-center justify-between border-y py-1 rtl:flex-row-reverse print:hidden">
          <SaveBookmark />

          {navigatorShareSupported && (
            <Button
              priority="tertiary no outline"
              onClick={handleShare}
              iconId="ri-share-forward-line"
            >
              {t("Dispositif.shareShort", "Partager")}
            </Button>
          )}

          <LanguageMenu
            mobileMode="modal"
            desktopMode="dropdown"
            dropDownClassName="max-sm:max-w-[90vw] rtl:!left-auto"
            variant="flag"
            className="ltr:ms-auto [&_button]:shadow-none"
            languageSelectorType="page"
            availableLanguages={dispositif?.availableLanguages}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
