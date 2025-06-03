import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import { activatedLanguages } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { DropdownContent, DropdownRoot, DropdownTrigger } from "~/components/UI/DropDown/DropDown";
import Flag from "~/components/UI/Flag";
import { LanguageSelector } from "~/components/UI/LanguageSelector/LanguageSelector";
import { useLocale } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import useWindowSize from "~/hooks/useWindowSize";
import { cn } from "~/lib/classname";
import styles from "./LanguageMenu.module.scss";

interface Props {
  variant?: "flag";
  mode?: "dropdown" | "accordion" | "both";
  className?: string;
  dropDownClassName?: string;
}

const LanguageMenu = ({ variant, mode = "both", className, dropDownClassName }: Props) => {
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
      {mode === "accordion" || (isMobile && mode === "both") ? (
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
        <DropdownRoot
          className={className}
          ref={dropdownRef}
          key="language"
          onOpenChange={(open) => setLangMenuOpened(open)}
        >
          <DropdownTrigger asChild>
            <Button priority="tertiary" className="flex gap-2">
              {variant === "flag" ? (
                <Flag langueCode={currentLanguage?.langueCode || "fr"} className="me-2" />
              ) : (
                <i className="fr-icon-translate-2 fr-icon--sm" />
              )}
              {locale?.toLocaleUpperCase()}{" "}
              <i className={cn(langMenuOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
            </Button>
          </DropdownTrigger>
          <DropdownContent position="start" className={dropDownClassName}>
            <LanguageSelector onChangeLang={handleToggleDesktopDopdown} />
          </DropdownContent>
        </DropdownRoot>
      )}
    </>
  );
};

export default LanguageMenu;
