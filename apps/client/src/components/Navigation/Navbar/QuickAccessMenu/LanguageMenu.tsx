import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import { activatedLanguages } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { DropdownContent, DropdownRoot, DropdownTrigger } from "~/components/UI/DropDown/DropDown";
import { LanguageSelector } from "~/components/UI/LanguageSelector/LanguageSelector";
import { useLocale } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";
import styles from "./LanguageMenu.module.scss";

const LanguageMenu = () => {
  const [langMenuOpened, setLangMenuOpened] = useState(false);

  const locale = useLocale();
  const currentLanguage = activatedLanguages.find((lang) => lang.i18nCode === locale);

  const { isMobile } = useWindowSize();
  const stylesDisabled = useStylesDisabled();
  const { t } = useTranslation();

  const dropdownRef = useRef<{ closeDropdown: () => void }>(null);

  const handleToggleMobileMenu = () => {
    const dsfrMenu = document.getElementById("header-menu-modal-fr-header");
    const dsrfMenuButton = document.getElementById("fr-header-menu-button");
    const bodyTag = document.querySelector("body");

    dsfrMenu?.classList.remove("fr-modal--opened");
    dsrfMenuButton?.setAttribute("data-fr-opened", "false");
    bodyTag?.removeAttribute("style");
  };

  const handleToggleDesktopDopdown = () => {
    dropdownRef.current?.closeDropdown();
    setLangMenuOpened(false);
  };
  return (
    <>
      {stylesDisabled && <span>{t("Toolbar.Langue", "Langue :")}</span>}
      {isMobile ? (
        <Accordion
          label={
            <>
              <i className="fr-icon-translate-2" />
              {currentLanguage?.langueFr} - {currentLanguage?.langueLoc}
            </>
          }
          className={styles.langAccordion}
        >
          <LanguageSelector onChangeLang={handleToggleMobileMenu} />
        </Accordion>
      ) : (
        <DropdownRoot ref={dropdownRef} key="language" onOpenChange={(open) => setLangMenuOpened(open)}>
          <DropdownTrigger asChild>
            <Button iconId="fr-icon-translate-2" priority="tertiary">
              {locale?.toLocaleUpperCase()}{" "}
              <i className={cls(langMenuOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
            </Button>
          </DropdownTrigger>
          <DropdownContent position="start">
            <LanguageSelector onChangeLang={handleToggleDesktopDopdown} />
          </DropdownContent>
        </DropdownRoot>
      )}
    </>
  );
};

export default LanguageMenu;
