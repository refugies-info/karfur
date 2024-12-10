import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import { activatedLanguages } from "data/activatedLanguages";
import router from "next/router";
import { useState } from "react";
import { DropdownContent, DropdownRoot, DropdownTrigger } from "~/components/UI/DropDown/DropDown";
import { LanguageSelect } from "~/components/UI/LanguageSelect/LanguageSelect";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";
import styles from "./LanguageMenu.module.scss";

const LanguageMenu = () => {
  const [langMenuOpened, setLangMenuOpened] = useState(false);

  const locale = router.locale || "fr";
  const currentLanguage = activatedLanguages.find((lang) => lang.i18nCode === locale);

  const { isMobile } = useWindowSize();

  return isMobile ? (
    <Accordion
      label={
        <>
          <i className="fr-icon-translate-2" />
          {currentLanguage?.langueFr} - {currentLanguage?.langueLoc}
        </>
      }
      className={styles.langAccordion}
    >
      <LanguageSelect />
    </Accordion>
  ) : (
    <DropdownRoot key="language" onOpenChange={(open) => setLangMenuOpened(open)}>
      <DropdownTrigger asChild>
        <Button iconId="fr-icon-translate-2" priority="tertiary">
          {router.locale?.toLocaleUpperCase()}{" "}
          <i className={cls(langMenuOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
        </Button>
      </DropdownTrigger>
      <DropdownContent position="right">
        <LanguageSelect />
      </DropdownContent>
    </DropdownRoot>
  );
};

export default LanguageMenu;
