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
  const sortedLanguages = [...activatedLanguages].sort((a, b) => a.langueFr.localeCompare(b.langueFr));
  const frenchLanguage = sortedLanguages.find((lang) => lang.langueCode === "fr");

  if (frenchLanguage) {
    sortedLanguages.splice(sortedLanguages.indexOf(frenchLanguage), 1);
    sortedLanguages.unshift(frenchLanguage);
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
