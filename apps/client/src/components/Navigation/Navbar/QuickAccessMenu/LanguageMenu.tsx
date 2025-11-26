import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { useWindowSize } from "@refugies-info/ui";
import { activatedLanguages } from "data/activatedLanguages";
import { useTranslation } from "next-i18next";
import { useId, useRef, useState } from "react";
import { DropdownContent, DropdownRoot, DropdownTrigger } from "~/components/UI/DropDown/DropDown";
import Flag from "~/components/UI/Flag";
import { LanguageSelector } from "~/components/UI/LanguageSelector/LanguageSelector";
import { useLocale } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cn } from "~/lib/classname";
import styles from "./LanguageMenu.module.scss";

interface Props {
  variant?: "flag";
  mobileMode?: "modal" | "dropdown" | "accordion";
  desktopMode?: "modal" | "dropdown" | "accordion";
  className?: string;
  dropDownClassName?: string;
  languageSelectorType?: "global" | "page";
  itemsDesign?: "radio" | "default";
  availableLanguages?: string[] | null | undefined;
  key?: string;
}

const LanguageMenu = ({
  variant,
  mobileMode = "accordion",
  desktopMode = "dropdown",
  className,
  dropDownClassName,
  languageSelectorType = "global",
  availableLanguages = null,
  itemsDesign = "default",
  key,
}: Props) => {
  const [langMenuOpened, setLangMenuOpened] = useState(false);

  const locale = useLocale();
  let currentLanguage = activatedLanguages.find((lang) => lang.i18nCode === locale);

  if (availableLanguages?.length && !availableLanguages?.includes(currentLanguage?.i18nCode || "")) {
    currentLanguage = activatedLanguages.find((lang) => lang.i18nCode === "fr");
  }

  const { isMobile } = useWindowSize();

  const stylesDisabled = useStylesDisabled();
  const { t } = useTranslation();

  const dropdownRef = useRef<{ closeDropdown: () => void }>(null);
  const descriptionId = useId();

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
      {(isMobile && mobileMode === "accordion") || (!isMobile && desktopMode === "accordion") ? (
        <Accordion
          label={
            <>
              <i className="fr-icon-translate-2" />
              {currentLanguage?.langueFr} - {currentLanguage?.langueLoc}
            </>
          }
          className={styles.langAccordion}
          key={key}
        >
          <LanguageSelector
            onChangeLang={handleToggleMobileMenu}
            type={languageSelectorType}
            availableLanguages={availableLanguages}
            itemsDesign={itemsDesign}
          />
        </Accordion>
      ) : null}

      {(isMobile && mobileMode === "dropdown") || (!isMobile && desktopMode === "dropdown") ? (
        <DropdownRoot
          className={cn(className)}
          ref={dropdownRef}
          key={key}
          onOpenChange={(open) => setLangMenuOpened(open)}
        >
          <DropdownTrigger asChild>
            <Button priority="tertiary" className="flex gap-2">
              {variant === "flag" ? (
                <Flag langueCode={currentLanguage?.langueCode || "fr"} className="me-2" />
              ) : (
                <i className="fr-icon-translate-2 fr-icon--sm" />
              )}
              {currentLanguage?.i18nCode?.toLocaleUpperCase()}{" "}
              <i className={cn(langMenuOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
            </Button>
          </DropdownTrigger>
          <DropdownContent position="start" className={cn(dropDownClassName)}>
            <LanguageSelector
              onChangeLang={handleToggleDesktopDopdown}
              type={languageSelectorType}
              availableLanguages={availableLanguages}
              itemsDesign={itemsDesign}
              role="presentation"
            />
          </DropdownContent>
        </DropdownRoot>
      ) : null}

      {(isMobile && mobileMode === "modal") || (!isMobile && desktopMode === "modal") ? (
        <Dialog.Root open={langMenuOpened} onOpenChange={setLangMenuOpened} key={key}>
          <Dialog.Trigger asChild>
            <Button priority="tertiary no outline" className={cn("flex gap-2", className)}>
              {variant === "flag" ? (
                <Flag langueCode={currentLanguage?.langueCode || "fr"} className="me-2" />
              ) : (
                <i className="fr-icon-translate-2 fr-icon--sm" />
              )}
              {locale?.toLocaleUpperCase()}{" "}
              <i className={cn(langMenuOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
            </Button>
          </Dialog.Trigger>
          {langMenuOpened && (
            <>
              <style jsx global>{`
                body {
                  overflow: hidden;
                }
              `}</style>
              <Dialog.Portal>
                <Dialog.Content
                  className="fixed inset-0 z-1000001 flex h-screen w-screen flex-col overflow-y-auto bg-white"
                  aria-describedby={descriptionId}
                >
                  <Dialog.Title className="border-default-grey sticky top-0 z-50 mb-6 flex items-center justify-between border-b bg-white p-4 py-5">
                    {t("Dispositif.readIn", "Lire la fiche en")}
                    <Dialog.Close asChild>
                      <Button
                        iconId="fr-icon-close-line"
                        className="text-title-xs text-title-grey"
                        priority="tertiary no outline"
                        title="Fermer"
                      />
                    </Dialog.Close>
                  </Dialog.Title>
                  <Dialog.Description className="px-2" id={descriptionId}>
                    <LanguageSelector
                      onChangeLang={handleToggleDesktopDopdown}
                      type={languageSelectorType}
                      availableLanguages={availableLanguages}
                      itemsDesign={itemsDesign}
                    />
                  </Dialog.Description>
                </Dialog.Content>
              </Dialog.Portal>
            </>
          )}
        </Dialog.Root>
      ) : null}
    </>
  );
};

export default LanguageMenu;
