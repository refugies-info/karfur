import Badge from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { forwardRef, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useChangeLanguage } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageItem.module.scss";

interface LanguageItemProps {
  item: GetLanguagesResponse;
  className?: string;
  onChangeLang?: () => void;
}

const LanguageItem = memo(
  forwardRef<HTMLButtonElement, LanguageItemProps>(({ item, className, onChangeLang, ...props }, ref) => {
    const { t } = useTranslation();
    const stylesDisabled = useStylesDisabled();

    const { changeLanguage, loading } = useChangeLanguage();
    const currentLanguage = router.locale || "fr";

    const langues = useSelector(allLanguesSelector);
    const notListenableLanguages = ["er"];

    const handleChangeLanguage = useCallback(
      (lang: GetLanguagesResponse) => {
        Event("CHANGE_LANGUAGE", lang.i18nCode, "Global Modal");
        changeLanguage(lang.i18nCode, "replace", onChangeLang);
      },
      [changeLanguage, onChangeLang],
    );

    const getAvancementTrad = useCallback(
      (i18nCode: string) => {
        if (i18nCode === "fr") return 1;
        const language = langues.find((ln) => ln.i18nCode === i18nCode);
        return language ? Math.min(language.avancementTrad || 0, 1) : 0;
      },
      [langues],
    );

    return (
      <button
        ref={ref}
        data-nav-item
        className={cls(styles.item, currentLanguage === item.i18nCode && styles.selected, className)}
        key={item.langueCode}
        id={item.langueCode}
        title={className}
        onClick={(e) => {
          e.stopPropagation();
          handleChangeLanguage(item);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleChangeLanguage(item);
          }
        }}
        role="menuitem"
        tabIndex={0}
        {...props}
      >
        {loading && (
          <span className={styles.loader}>
            <b>{t("LanguageDropdown.loading", "Chargement de la langue")}</b>
          </span>
        )}
        <span>
          <b>{item.langueFr}</b> - {item.langueLoc}
        </span>{" "}
        {item.langueCode && notListenableLanguages.includes(item.langueCode) && (
          <Tag>{t("LanguageDropdown.not_listenable", "Non écoutable")}</Tag>
        )}{" "}
        {stylesDisabled ? (
          <>{Math.round(getAvancementTrad(item.i18nCode) * 100) + " %"}</>
        ) : (
          <Badge noIcon severity={getAvancementTrad(item.i18nCode) === 1 ? "success" : "new"}>
            {Math.round(getAvancementTrad(item.i18nCode) * 100) + " %"}
          </Badge>
        )}
      </button>
    );
  }),
);

LanguageItem.displayName = "LanguageItem";

export { LanguageItem };
