import FilterButton from "components/UI/FilterButton";
import TagName from "components/UI/TagName";
import { tags } from "data/tags";
import { cls } from "lib/classname";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedTags: string[];
  setSelectedTags: (callback: any) => void;
}

export const ThemesInput = (props: Props) => {
  const onTagsChange = (tag: string) => {
    if (props.selectedTags.includes(tag)) {
      // remove
      props.setSelectedTags((tags: string[]) => tags.filter((t) => t !== tag));
    } else {
      // add
      props.setSelectedTags((tags: string[]) => [...tags, tag]);
    }
  };

  return (
    <div className={parentStyles.form_block}>
      <label className={cls(parentStyles.label, "d-block mb-4")}>Thème(s)</label>
      {tags.map((tag) => (
        <FilterButton
          key={tag.short}
          active={props.selectedTags.includes(tag.short)}
          color={tag.darkColor}
          onClick={(e: any) => {
            e.preventDefault();
            onTagsChange(tag.short);
          }}
          className="mr-2 mb-2"
        >
          <TagName name={tag.short} icon={tag.icon} />
        </FilterButton>
      ))}
      <FilterButton
        active={props.selectedTags.length === tags.length}
        onClick={(e: any) => {
          e.preventDefault();
          if (props.selectedTags.length === tags.length) {
            props.setSelectedTags([]);
          } else {
            props.setSelectedTags(tags.map(tag => tag.short))
          }
        }}
        className="mr-2 mb-2"
      >
        Tous les thèmes
      </FilterButton>
    </div>
  );
};
