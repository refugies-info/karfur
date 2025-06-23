import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import * as Dialog from "@radix-ui/react-dialog";
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
  mobileMode?: "modal" | "dropdown" | "accordion";
  desktopMode?: "modal" | "dropdown" | "accordion";
  className?: string;
  dropDownClassName?: string;
  languageSelectorType?: "global" | "page";
  availableLanguages: string[] | null;
}

const LanguageMenu = ({
  variant,
  mobileMode = "accordion",
  desktopMode = "dropdown",
  className,
  dropDownClassName,
  languageSelectorType = "global",
  availableLanguages = null,
}: Props) => {
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
      {(isMobile && mobileMode === "accordion") || (!isMobile && desktopMode === "accordion") ? (
        <Accordion
          label={
            <>
              <i className="fr-icon-translate-2" />
              {currentLanguage?.langueFr} - {currentLanguage?.langueLoc}
            </>
          }
          className={styles.langAccordion}
        >
          <LanguageSelector
            onChangeLang={handleToggleMobileMenu}
            type={languageSelectorType}
            availableLanguages={availableLanguages}
          />
        </Accordion>
      ) : null}

      {(isMobile && mobileMode === "dropdown") || (!isMobile && desktopMode === "dropdown") ? (
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
            <LanguageSelector
              onChangeLang={handleToggleDesktopDopdown}
              type={languageSelectorType}
              availableLanguages={availableLanguages}
            />
          </DropdownContent>
        </DropdownRoot>
      ) : null}

      {(isMobile && mobileMode === "modal") || (!isMobile && desktopMode === "modal") ? (
        <Dialog.Root open={langMenuOpened} onOpenChange={setLangMenuOpened}>
          <Dialog.Trigger asChild>
            <Button priority="tertiary no outline" className="flex gap-2">
              {variant === "flag" ? (
                <Flag langueCode={currentLanguage?.langueCode || "fr"} className="me-2" />
              ) : (
                <i className="fr-icon-translate-2 fr-icon--sm" />
              )}
              {locale?.toLocaleUpperCase()}
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
                <Dialog.Content className="fixed inset-0 z-1000001 flex h-screen w-screen flex-col overflow-y-auto bg-white">
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
                  <Dialog.Description className="px-2">
                    <LanguageSelector type={languageSelectorType} availableLanguages={availableLanguages} />
                  </Dialog.Description>

                  <div className="border-default-grey sticky bottom-0 left-0 mt-auto flex w-full items-center justify-between border-t bg-white p-4 py-5">
                    <Button
                      priority="tertiary no outline"
                      iconId="fr-icon-close-line"
                      onClick={() => setLangMenuOpened(false)}
                    >
                      {t("Annuler", "Annuler")}
                    </Button>
                    <Dialog.Close asChild>
                      <Button>{t("Dispositif.seeSheet", "Voir la fiche")}</Button>
                    </Dialog.Close>
                  </div>
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
