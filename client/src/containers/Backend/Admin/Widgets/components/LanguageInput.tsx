import { cls } from "lib/classname";
import { Language } from "types/interface";
import FilterButton from "components/UI/FilterButton";
import LanguageText from "components/UI/Language";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedLanguages: string[];
  setSelectedLanguages: (callback: any) => void;
  languages: Language[];
}

export const LanguageInput = (props: Props) => {
  // in version 1, only 1 language allowed ?
  const onLanguageChange = (language: string) => {
    if (props.selectedLanguages?.[0] === language) {
      props.setSelectedLanguages([]);
    } else {
      props.setSelectedLanguages([language]);
    }
  };
  return (
    <div className={parentStyles.form_block}>
      <label className={cls(parentStyles.label, "d-block mb-4")}>Fiches traduites en...</label>
      <div>
        {props.languages.map((item, index: number) => (
          <FilterButton
            key={index}
            onClick={(e: any) => {
              e.preventDefault();
              if (item._id) onLanguageChange(item.i18nCode);
            }}
            active={item._id && props.selectedLanguages.includes(item.i18nCode)}
            className="me-2 mb-2"
          >
            <LanguageText langueCode={item.langueCode} />
          </FilterButton>
        ))}
      </div>
    </div>
  );
};
