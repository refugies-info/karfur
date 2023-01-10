import FilterButton from "components/UI/FilterButton";
import { cls } from "lib/classname";
import { ContentType } from "types/interface";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedTypeContenu: ContentType[];
  setSelectedTypeContenu: (callback: any) => void;
}

export const TypeContenuInput = (props: Props) => {
  const onTypeContenuChange = (typeContenu: ContentType) => {
    if (props.selectedTypeContenu.includes(typeContenu)) {
      // remove
      props.setSelectedTypeContenu((types: string[]) => types.filter((t) => t !== typeContenu));
    } else {
      // add
      props.setSelectedTypeContenu((types: string[]) => [...types, typeContenu]);
    }
  };
  return (
    <div className={cls(parentStyles.form_block, "d-flex align-items-center")}>
      <label className={cls(parentStyles.label, "me-4")}>Type(s)</label>
      <FilterButton
        onClick={(e: any) => {
          e.preventDefault();
          onTypeContenuChange("dispositif");
        }}
        active={props.selectedTypeContenu.includes("dispositif")}
        className="me-2"
      >
        Dispositif
      </FilterButton>
      <FilterButton
        onClick={(e: any) => {
          e.preventDefault();
          onTypeContenuChange("demarche");
        }}
        active={props.selectedTypeContenu.includes("demarche")}
      >
        Démarche
      </FilterButton>
    </div>
  );
};
