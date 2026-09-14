import Badge from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import type { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { forwardRef, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useChangeLanguage, useLocale } from "~/hooks";
import { checkIsRTL } from "~/hooks/useRTL";
import { cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageItem.module.scss";

interface LanguageItemProps {
  item: GetLanguagesResponse;
  className?: string;
  onChangeLang?: () => void;
  type?: "global" | "page";
  design?: "radio" | "default";
  disabled?: boolean;
  forceActive?: boolean;
}

const LanguageItem = memo(
  forwardRef<HTMLButtonElement, LanguageItemProps>(
    (
      {
        item,
        className,
        onChangeLang,
        type = "global",
        design = "default",
        disabled = false,
        forceActive = false,
        ...props
      },
      ref,
    ) => {
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
          className={cn(
            styles.item,
            styles[`design-${design}`],
            (currentLanguage === item.i18nCode && !disabled) || forceActive ? styles.selected : "",
            type === "page" && "[&:before]:hidden",
            disabled &&
              `disabled [&_*]:text-disabled-grey hover:bg-white [&_*]:pointer-events-none [&_*]:cursor-not-allowed ${styles.disabled}`,
            className,
          )}
          disabled={disabled}
          aria-disabled={disabled}
          key={item.langueCode}
          id={item.langueCode}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            handleChangeLanguage(item);
          }}
          {...props}
        >
          {loading && (
            <span className={styles.loader}>
              <b>{t("LanguageDropdown.loading", "Chargement de la langue")}</b>
            </span>
          )}
          {design === "radio" && (
            <span
              className={cn(
                "relative h-4 w-4 flex-none rounded-full ring",
                (currentLanguage === item.i18nCode && !disabled) || forceActive
                  ? "bg-active-blue-france border-3 border-white"
                  : "",
                disabled && "ring-disabled-grey",
              )}
            ></span>
          )}
          <span className="langLabel">
            <b>{item.langueFr}</b> -{" "}
            <span lang={item.i18nCode} dir={checkIsRTL(item.i18nCode) ? "rtl" : undefined}>
              {item.langueLoc}
            </span>
          </span>{" "}
          {type === "global" && (
            <>
              {item.langueCode && notListenableLanguages.includes(item.langueCode) && (
                <Tag>{t("LanguageDropdown.not_listenable", "Non écoutable")}</Tag>
              )}{" "}
              <span dir="ltr" className="ms-auto">
                <Badge
                  as="span"
                  noIcon
                  severity={getAvancementTrad(item.i18nCode) === 1 ? "success" : "new"}
                >
                  {Math.round(getAvancementTrad(item.i18nCode) * 100) + " %"}
                </Badge>
              </span>
            </>
          )}
          {type === "page" && (
            <span dir="ltr" className="ms-auto">
              <i
                role="img"
                aria-label={
                  disabled
                    ? t("LanguageDropdown.translation_in_progress", "En cours de traduction")
                    : t("LanguageDropdown.translation_available", "Traduction disponible")
                }
                className={cn(
                  disabled ? "ri-progress-5-line" : "fr-icon-success-fill !text-default-success",
                )}
              />
            </span>
          )}
        </button>
      );
    },
  ),
);

LanguageItem.displayName = "LanguageItem";

export { LanguageItem };
