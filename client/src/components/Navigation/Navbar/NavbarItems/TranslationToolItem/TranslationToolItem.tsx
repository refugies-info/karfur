import { ToolTranslate, ToolTranslateItem } from "@dataesr/react-dsfr";
import { activatedLanguages } from "data/activatedLanguages";
import { Event } from "lib/tracking";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { getPath, PathNames } from "routes";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";

const TranslationToolItem = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentLanguage = activatedLanguages.find((ln) => ln.i18nCode === router.locale) || null;

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));

    const { pathname, query } = router;
    return router.replace(
      {
        pathname: getPath(pathname as PathNames, lng),
        query
      },
      undefined,
      { locale: lng }
    );
  };

  return (
    <ToolTranslate currentLang={currentLanguage?.langueLoc || ""} descCurrentLang={currentLanguage?.langueLoc || ""}>
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
  );
};

TranslationToolItem.defaultProps = {
  __TYPE: "ToolTranslate"
};

export default TranslationToolItem;
