import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import "moment/locale/fa";
import "moment/locale/fr";
import "moment/locale/ru";
import "moment/locale/uk";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import LanguageMenu from "~/components/Navigation/Navbar/QuickAccessMenu/LanguageMenu";
import { SponsorsEdit } from "~/components/Pages/dispositif/Edition";
import SaveBookmark from "~/components/Pages/dispositif/SaveBookmark";
import SectionButtons from "~/components/Pages/dispositif/SectionButtons";
import Sponsors from "~/components/Pages/dispositif/Sponsors";
import Image from "~/components/UI/Image";
import { useLocale, useWindowSize } from "~/hooks";
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

  return (
    <header className="relative">
      {isViewMode && (
        <SectionButtons
          className="lg:absolute lg:-top-10 lg:ltr:-right-8 lg:rtl:-left-8"
          id="titreInformatif"
          content={vocalizationContent}
        />
      )}

      <Title />

      {isViewMode && dispositif?.titreMarque && (
        <span className="text-corps-xl mb-8 block">
          {t("Dispositif.with")} {dispositif?.titreMarque}{" "}
        </span>
      )}

      <div className="flex items-center gap-3 text-sm">
        {dispositif?.mainSponsor?.picture?.secure_url && (
          <span className="border-default-grey relative inline-grid aspect-square h-14 w-14 items-center justify-center border p-1">
            <Image
              src={dispositif?.mainSponsor?.picture?.secure_url}
              width={150}
              height={150}
              alt={dispositif?.mainSponsor?.nom || ""}
              className=""
            />
          </span>
        )}

        <span className="flex flex-col gap-1">
          {isViewMode ? <Sponsors sponsors={dispositif?.sponsors} /> : <SponsorsEdit />}
          {isViewMode && dispositif?.date && (
            <span className="text-mention-grey">{`${t("Dispositif.updated")} ${moment(dispositif.date).fromNow()}`}</span>
          )}
        </span>
      </div>

      {isViewMode && (
        <div className="border-default-grey my-8 flex items-center justify-between border-y py-1 rtl:flex-row-reverse">
          <SaveBookmark />
          <LanguageMenu
            mobileMode="modal"
            desktopMode="dropdown"
            dropDownClassName="max-sm:max-w-[90vw]"
            variant="flag"
            className="[&_button]:shadow-none"
            languageSelectorType="page"
            availableLanguages={dispositif?.availableLanguages || null}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
