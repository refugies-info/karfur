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
  return (
    <AccessibleNavigation ref={ref} {...props} orientation="vertical" aria-label="Languages">
      {activatedLanguages.map((lang, index) => {
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
