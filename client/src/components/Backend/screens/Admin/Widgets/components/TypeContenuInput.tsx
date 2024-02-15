import { ContentType } from "@refugies-info/api-types";
import FilterButton from "components/UI/FilterButton";
import { cls } from "lib/classname";
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
          onTypeContenuChange(ContentType.DISPOSITIF);
        }}
        active={props.selectedTypeContenu.includes(ContentType.DISPOSITIF)}
        className="me-2"
      >
        Dispositif
      </FilterButton>
      <FilterButton
        onClick={(e: any) => {
          e.preventDefault();
          onTypeContenuChange(ContentType.DEMARCHE);
        }}
        active={props.selectedTypeContenu.includes(ContentType.DEMARCHE)}
      >
        Démarche
      </FilterButton>
    </div>
  );
};
