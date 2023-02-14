import { GetThemeResponse, Id } from "api-types";
import FilterButton from "components/UI/FilterButton";
import TagName from "components/UI/TagName";
import { cls } from "lib/classname";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedThemes: Id[];
  setSelectedThemes: (callback: (themes: Id[]) => void) => void;
}

export const ThemesInput = (props: Props) => {
  const themes = useSelector(themesSelector);

  const onTagsChange = (themeId: Id) => {
    if (props.selectedThemes.find((id) => id === themeId)) {
      // remove
      props.setSelectedThemes((themes: Id[]) => themes.filter((id) => id !== themeId));
    } else {
      // add
      props.setSelectedThemes((themes: Id[]) => [...themes, themeId]);
    }
  };

  return (
    <div className={parentStyles.form_block}>
      <label className={cls(parentStyles.label, "d-block mb-4")}>Thème(s)</label>
      {themes.map((theme) => (
        <FilterButton
          key={theme.short.fr}
          active={props.selectedThemes.find((id) => id === theme._id)}
          color={theme.colors.color100}
          onClick={(e: any) => {
            e.preventDefault();
            onTagsChange(theme._id);
          }}
          className="me-2 mb-2"
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
            props.setSelectedThemes(() => themes.map((t) => t._id));
          }
        }}
        className="me-2 mb-2"
      >
        Tous les thèmes
      </FilterButton>
    </div>
  );
};
