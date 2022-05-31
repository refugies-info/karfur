import { ObjectId } from "mongodb";
import { cls } from "lib/classname";
import { Language } from "types/interface";
import FilterButton from "components/UI/FilterButton";
import LanguageText from "components/UI/Language";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedLanguages: ObjectId[];
  setSelectedLanguages: (callback: any) => void;
  languages: Language[];
}

export const LanguageInput = (props: Props) => {
  const onLanguageChange = (language: ObjectId) => {
    if (props.selectedLanguages.includes(language)) {
      // remove
      props.setSelectedLanguages((ln: ObjectId[]) =>
        ln.filter((l) => l !== language)
      );
    } else {
      // add
      props.setSelectedLanguages((ln: ObjectId[]) => [...ln, language]);
    }
  };
  return (
    <div className={parentStyles.form_block}>
      <label className={cls(parentStyles.label, "d-block mb-4")}>
        Fiches traduites en...
      </label>
      <div>
        {props.languages.map((item, index: number) => (
          <FilterButton
            key={index}
            onClick={(e: any) => {
              e.preventDefault();
              if (item._id) onLanguageChange(item._id);
            }}
            active={item._id && props.selectedLanguages.includes(item._id)}
            className="mr-2 mb-2"
          >
            <LanguageText langueCode={item.langueCode} />
          </FilterButton>
        ))}
      </div>
    </div>
  );
};
