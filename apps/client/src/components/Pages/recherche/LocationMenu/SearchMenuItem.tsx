import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslation } from "next-i18next";
import React, { useRef } from "react";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchMenuItem: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <form className="w-full min-w-52" onClick={(e) => e.preventDefault()} onSubmit={(e) => e.preventDefault()}>
      <Input
        iconId="fr-icon-search-line"
        ref={ref}
        className="[&_.fr-icon-search-line::before]:bg-flat-blue-france mb-2 [&_.fr-icon-search-line::before]:scale-120 ltr:[&_.fr-icon-search-line::before]:right-[unset] ltr:[&_.fr-icon-search-line::before]:left-2 ltr:[&_.fr-input]:ps-8 ltr:[&_.fr-input]:pe-4 [&_input]:w-full [&_label]:sr-only"
        label={t("Recherche.searchPlaceholder", "Recherche par ville")}
        nativeInputProps={{
          type: "search",
          placeholder: t("Recherche.searchPlaceholder", "Recherche par ville"),
          onChange,
          className: "fr-input-wrap fr-icon-search-line",
        }}
      />
    </form>
  );
};

export default SearchMenuItem;
