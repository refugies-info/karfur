import { activatedLanguages } from "data/activatedLanguages";
import { forwardRef } from "react";
import {
  AccessibleNavigation,
  AccessibleNavigationItem,
} from "~/components/UI/AccessibleNavigation/AccessibleNavigation";
import { LanguageItem } from "~/components/UI/LanguageSelect/LanguageItem";

interface LanguageSelectProps {}

const LanguageSelect = forwardRef<HTMLDivElement, LanguageSelectProps>((props, ref) => {
  return (
    <AccessibleNavigation ref={ref} {...props} orientation="vertical" aria-label="Languages">
      {activatedLanguages.map((lang, index) => {
        return (
          <AccessibleNavigationItem key={index} asChild>
            <LanguageItem item={lang} />
          </AccessibleNavigationItem>
        );
      })}
    </AccessibleNavigation>
  );
});

LanguageSelect.displayName = "LanguageSelect";

export { LanguageSelect };
