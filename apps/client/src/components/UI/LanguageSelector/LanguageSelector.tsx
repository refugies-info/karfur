import { activatedLanguages } from "data/activatedLanguages";
import { forwardRef } from "react";
import {
  AccessibleNavigation,
  AccessibleNavigationItem,
} from "~/components/UI/AccessibleNavigation/AccessibleNavigation";
import { LanguageItem } from "~/components/UI/LanguageSelector/LanguageItem";

interface LanguageSelectProps {
  onChangeLang?: () => void;
}

const LanguageSelector = forwardRef<HTMLDivElement, LanguageSelectProps>(({ onChangeLang, ...props }, ref) => {
  const sortedLanguages = [...activatedLanguages];
  sortedLanguages.sort((a, b) => a.langueFr.localeCompare(b.langueFr));

  const frenchLanguage = activatedLanguages.find((lang) => lang.langueCode === "fr");
  if (frenchLanguage) {
    sortedLanguages.unshift(frenchLanguage);
    const duplicateIndex = sortedLanguages.findIndex((lang, index) => index > 0 && lang.langueCode === "fr");
    if (duplicateIndex !== -1) {
      sortedLanguages.splice(duplicateIndex, 1);
    }
  }

  return (
    <AccessibleNavigation ref={ref} {...props} orientation="vertical" aria-label="Languages">
      {sortedLanguages.map((lang, index) => {
        return (
          <AccessibleNavigationItem key={index} asChild>
            <LanguageItem item={lang} onChangeLang={onChangeLang} />
          </AccessibleNavigationItem>
        );
      })}
    </AccessibleNavigation>
  );
});

LanguageSelector.displayName = "LanguageSelector";

export { LanguageSelector };
