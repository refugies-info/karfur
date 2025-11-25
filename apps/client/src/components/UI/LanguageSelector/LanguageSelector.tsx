import { activatedLanguages } from "data/activatedLanguages";
import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";
import {
  AccessibleNavigation,
  AccessibleNavigationItem,
} from "~/components/UI/AccessibleNavigation/AccessibleNavigation";
import { LanguageItem } from "~/components/UI/LanguageSelector/LanguageItem";
import { useLocale } from "~/hooks";

interface LanguageSelectProps extends HTMLAttributes<HTMLDivElement> {
  onChangeLang?: () => void;
  type?: "global" | "page";
  itemsDesign?: "radio" | "default";
  availableLanguages?: string[] | null;
}

const LanguageSelector = forwardRef<HTMLDivElement, LanguageSelectProps>(
  ({ onChangeLang, type = "global", itemsDesign = "default", availableLanguages, ...props }, ref) => {
    const sortedLanguages = [...activatedLanguages].sort((a, b) => a.langueFr.localeCompare(b.langueFr));
    const frenchLanguage = sortedLanguages.find((lang) => lang.langueCode === "fr");
    const currentLanguage = useLocale();
    const forceFrenchLanguage =
      availableLanguages?.length && !availableLanguages?.includes(currentLanguage) ? true : false;
    const firstItemRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      firstItemRef?.current?.focus();
    }, []);

    if (frenchLanguage) {
      sortedLanguages.splice(sortedLanguages.indexOf(frenchLanguage), 1);
      sortedLanguages.unshift(frenchLanguage);
    }

    return (
      <AccessibleNavigation ref={ref} {...props} orientation="vertical" aria-label="Languages">
        {sortedLanguages.map((lang, index) => {
          const isDisabled = availableLanguages ? !availableLanguages?.includes(lang?.i18nCode || "") : false;

          return (
            <AccessibleNavigationItem key={index} asChild>
              <LanguageItem
                item={lang}
                forceActive={forceFrenchLanguage && lang.langueCode === "fr"}
                onChangeLang={isDisabled ? undefined : onChangeLang}
                type={type}
                design={itemsDesign}
                disabled={isDisabled}
                ref={index === 0 ? firstItemRef : undefined}
              />
            </AccessibleNavigationItem>
          );
        })}
      </AccessibleNavigation>
    );
  },
);

LanguageSelector.displayName = "LanguageSelector";

export { LanguageSelector };
