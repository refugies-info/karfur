import FilterButton from "components/UI/FilterButton";
import { cls } from "lib/classname";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedTypeContenu: string[];
  setSelectedTypeContenu: (callback: any) => void;
}

export const TypeContenuInput = (props: Props) => {
  const onTypeContenuChange = (typeContenu: "demarches" | "dispositifs") => {
    if (props.selectedTypeContenu.includes(typeContenu)) {
      // remove
      props.setSelectedTypeContenu((types: string[]) =>
        types.filter((t) => t !== typeContenu)
      );
    } else {
      // add
      props.setSelectedTypeContenu((types: string[]) => [
        ...types,
        typeContenu,
      ]);
    }
  };
  return (
    <div className={cls(parentStyles.form_block, "d-flex align-items-center")}>
      <label className={cls(parentStyles.label, "mr-4")}>Type(s)</label>
      <FilterButton
        onClick={(e: any) => {
          e.preventDefault();
          onTypeContenuChange("dispositifs");
        }}
        active={props.selectedTypeContenu.includes("dispositifs")}
        className="mr-2"
      >
        Dispositif
      </FilterButton>
      <FilterButton
        onClick={(e: any) => {
          e.preventDefault();
          onTypeContenuChange("demarches");
        }}
        active={props.selectedTypeContenu.includes("demarches")}
      >
        Démarche
      </FilterButton>
    </div>
  );
};
