import Input from "@codegouvfr/react-dsfr/Input";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { memo } from "react";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchMenuItem = memo<Props>(({ onChange }) => {
  const { t } = useTranslation();
  const placeholder = t("Recherche.searchPlaceholder", "Recherche par ville ou département");

  const inputClassName = cn(
    "mb-2",
    "[&_.fr-icon-search-line::before]:bg-flat-blue-france",
    "[&_.fr-icon-search-line::before]:scale-120",
    "ltr:[&_.fr-icon-search-line::before]:!right-[unset]",
    "ltr:[&_.fr-icon-search-line::before]:left-2",
    "ltr:[&_.fr-input]:!ps-8",
    "ltr:[&_.fr-input]:pe-4",
    "[&_input]:w-full",
    "[&_label]:sr-only",
  );

  return (
    <form className="w-full min-w-52" onSubmit={(e) => e.preventDefault()}>
      <Input
        iconId="fr-icon-search-line"
        className={inputClassName}
        label={placeholder}
        nativeInputProps={{
          type: "search",
          placeholder,
          onChange,
          className: "fr-input-wrap fr-icon-search-line",
        }}
      />
    </form>
  );
});

SearchMenuItem.displayName = "SearchMenuItem";

export default SearchMenuItem;
