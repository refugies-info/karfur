import FilterButton from "components/UI/FilterButton";
import TagName from "components/UI/TagName";
import { cls } from "lib/classname";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { Theme } from "types/interface";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedThemes: Theme[];
  setSelectedThemes: (callback: (themes: Theme[]) => void) => void;
}

export const ThemesInput = (props: Props) => {
  const themes = useSelector(themesSelector);

  const onTagsChange = (theme: Theme) => {
    if (props.selectedThemes.find(t => t._id === theme._id)) {
      // remove
      props.setSelectedThemes((themes: Theme[]) => themes.filter((t) => t._id !== theme._id));
    } else {
      // add
      props.setSelectedThemes((themes: Theme[]) => [...themes, theme]);
    }
  };

  return (
    <div className={parentStyles.form_block}>
      <label className={cls(parentStyles.label, "d-block mb-4")}>Thème(s)</label>
      {themes.map((theme) => (
        <FilterButton
          key={theme.short.fr}
          active={props.selectedThemes.find(t => t._id === theme._id)}
          color={theme.colors.color100}
          onClick={(e: any) => {
            e.preventDefault();
            onTagsChange(theme);
          }}
          className="mr-2 mb-2"
        >
          <TagName theme={theme} />
        </FilterButton>
      ))}
      <FilterButton
        active={props.selectedThemes.length === themes.length}
        onClick={(e: any) => {
          e.preventDefault();
          if (props.selectedThemes.length === themes.length) {
            props.setSelectedThemes(() => []);
          } else {
            props.setSelectedThemes(() => themes);
          }
        }}
        className="mr-2 mb-2"
      >
        Tous les thèmes
      </FilterButton>
    </div>
  );
};
