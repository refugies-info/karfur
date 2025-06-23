import Badge from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { forwardRef, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useChangeLanguage, useLocale } from "~/hooks";
import { cls, cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageItem.module.scss";

interface LanguageItemProps {
  item: GetLanguagesResponse;
  className?: string;
  onChangeLang?: () => void;
  type?: "global" | "page";
  disabled?: boolean;
}

const LanguageItem = memo(
  forwardRef<HTMLButtonElement, LanguageItemProps>(
    ({ item, className, onChangeLang, type = "global", disabled = false, ...props }, ref) => {
      const { t } = useTranslation();

      const { changeLanguage, loading } = useChangeLanguage();
      const currentLanguage = useLocale();

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
          className={cls(
            styles.item,
            currentLanguage === item.i18nCode && styles.selected,
            type === "page" && "[&:before]:hidden",
            disabled &&
              `disabled [&_*]:text-disabled-grey hover:bg-white [&_*]:pointer-events-none [&_*]:cursor-not-allowed ${styles.disabled}`,
            className,
          )}
          disabled={disabled}
          aria-disabled={disabled}
          key={item.langueCode}
          id={item.langueCode}
          title={`${item.langueFr} - ${item.langueLoc}`}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            handleChangeLanguage(item);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (disabled) return;
              handleChangeLanguage(item);
            }
          }}
          role="menuitem"
          tabIndex={disabled ? -1 : 0}
          {...props}
        >
          {loading && (
            <span className={styles.loader}>
              <b>{t("LanguageDropdown.loading", "Chargement de la langue")}</b>
            </span>
          )}
          {type === "page" && (
            <span
              className={cn(
                "relative h-6 w-6 flex-none rounded-full ring",
                currentLanguage === item.i18nCode && "bg-active-blue-france border-5 border-white",
                disabled && "ring-disabled-grey",
              )}
            ></span>
          )}
          <span className="langLabel">
            <b>{item.langueFr}</b> - {item.langueLoc}
          </span>{" "}
          {type === "global" && (
            <>
              {item.langueCode && notListenableLanguages.includes(item.langueCode) && (
                <Tag>{t("LanguageDropdown.not_listenable", "Non écoutable")}</Tag>
              )}{" "}
              <span dir="ltr" className="ms-auto">
                <Badge as="span" noIcon severity={getAvancementTrad(item.i18nCode) === 1 ? "success" : "new"}>
                  {Math.round(getAvancementTrad(item.i18nCode) * 100) + " %"}
                </Badge>
              </span>
            </>
          )}
          {type === "page" && (
            <span dir="ltr" className="ms-auto">
              <i className={cn(disabled ? "ri-progress-5-line" : "fr-icon-success-fill !text-default-success")} />
            </span>
          )}
        </button>
      );
    },
  ),
);

LanguageItem.displayName = "LanguageItem";

export { LanguageItem };
