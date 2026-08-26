import { activatedLanguages } from "data/activatedLanguages";
import { forwardRef, type HTMLAttributes, useEffect, useRef } from "react";
import { LanguageItem } from "~/components/UI/LanguageSelector/LanguageItem";
import { useLocale } from "~/hooks";
import { cn } from "~/lib/classname";

interface LanguageSelectProps extends HTMLAttributes<HTMLUListElement> {
  onChangeLang?: () => void;
  type?: "global" | "page";
  itemsDesign?: "radio" | "default";
  availableLanguages?: string[] | null;
}

const LanguageSelector = forwardRef<HTMLUListElement, LanguageSelectProps>(
  (
    {
      onChangeLang,
      type = "global",
      itemsDesign = "default",
      availableLanguages,
      className,
      ...props
    },
    ref,
  ) => {
    const sortedLanguages = [...activatedLanguages].sort((a, b) =>
      a.langueFr.localeCompare(b.langueFr),
    );
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

    // mt-2 sur le ul et p-0 sur les li : neutralise la marge haute du ul et le padding bas
    // des li posés par la base DSFR, pour un rendu identique à l'ancienne structure
    return (
      <ul ref={ref} className={cn("mx-0 mt-2 mb-0 list-none p-0", className)} {...props}>
        {sortedLanguages.map((lang, index) => {
          const isDisabled = availableLanguages
            ? !availableLanguages?.includes(lang?.i18nCode || "")
            : false;

          return (
            <li key={index} className="p-0">
              <LanguageItem
                item={lang}
                forceActive={forceFrenchLanguage && lang.langueCode === "fr"}
                onChangeLang={isDisabled ? undefined : onChangeLang}
                type={type}
                design={itemsDesign}
                disabled={isDisabled}
                ref={index === 0 ? firstItemRef : undefined}
              />
            </li>
          );
        })}
      </ul>
    );
  },
);

LanguageSelector.displayName = "LanguageSelector";

export { LanguageSelector };
