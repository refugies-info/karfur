import { useMemo } from "react";
import { ToolTranslate, ToolTranslateItem } from "@dataesr/react-dsfr";
import { activatedLanguages } from "data/activatedLanguages";
import { useChangeLanguage } from "hooks";
import { Event } from "lib/tracking";
import { useRouter } from "next/router";
import Tooltip from "components/UI/Tooltip";
import { cls } from "lib/classname";
import styles from "./TranslationToolItem.module.scss";

const TranslationToolItem = () => {
  const router = useRouter();

  const currentLanguage = activatedLanguages.find((ln) => ln.i18nCode === router.locale) || null;
  const { changeLanguage } = useChangeLanguage();

  const isEditionMode = useMemo(() => {
    return ["/dispositif", "/demarche", "/dispositif/[id]/edit", "/demarche/[id]/edit"].includes(router.pathname);
  }, [router.pathname]);

  return (
    <span id="translation-tool-item">
      <ToolTranslate
        currentLang={currentLanguage?.langueLoc || ""}
        descCurrentLang={currentLanguage?.langueLoc || ""}
        className={cls(isEditionMode && styles.disabled)}
      >
        {activatedLanguages.map((ln) => (
          <ToolTranslateItem
            onClick={() => {
              Event("CHANGE_LANGUAGE", ln.i18nCode, "label");
              changeLanguage(ln.i18nCode);
            }}
            key={ln.i18nCode}
            //   href={getPath(router.pathname as PathNames, ln.i18nCode)}
            href="#"
            hrefLang={ln.i18nCode}
            active={router.locale === ln.i18nCode}
          >
            <b>{ln.langueFr}</b> - {ln.langueLoc}
          </ToolTranslateItem>
        ))}
      </ToolTranslate>

      {isEditionMode && (
        <Tooltip target="translation-tool-item" placement="bottom">
          L’éditeur de fiche est disponible uniquement en français.
        </Tooltip>
      )}
    </span>
  );
};

TranslationToolItem.defaultProps = {
  __TYPE: "ToolTranslate",
};

export default TranslationToolItem;
