import React, { useState } from "react";
import styled from "styled-components";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { filtres } from "data/dispositif";
import FButton from "components/FigmaUI/FButton/FButton";
import { CustomDropDown } from "components/Pages/annuaire-create/CustomDropdown";
import { CustomCheckBox } from "components/Pages/annuaire-create/CustomCheckBox";
import FInput from "components/FigmaUI/FInput/FInput";
import Modal from "../Modal";
import styles from "./GeolocModal.module.scss";

interface Props {
  show: boolean
  toggleTutorielModal: any
  validateDepartments: any
  departments: string[] | undefined
  hideModal: any
}

const GeolocModal = (props: Props) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [isFranceSelected, setFranceSelected] = useState(
    props.departments && props.departments.includes("All")
  );
  const [selectedDepartments, setSelectedDepartments] = useState(
    props.departments || []
  );
  const [departmentInput, setDepartmentInput] = useState("");
  const onDepartmentChange = (e: any) => {
    setDepartmentInput(e.target.value);
    if (e.target.value === "") {
      return setDepartments([]);
    }
    const departmentsDataFiltered = filtres.departmentsData.filter(
      (department) =>
        selectedDepartments ? !selectedDepartments.includes(department) : false
    );

    const filteredDepartments = departmentsDataFiltered.filter((department) =>
      department.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setDepartments(filteredDepartments);
  };

  const removeDropdowElement = (element: any) => {
    const departments = selectedDepartments
      ? selectedDepartments.filter((department) => department !== element)
      : [];
    setSelectedDepartments(departments);
  };

  const handleCheckboxChange = () => {
    if (selectedDepartments && selectedDepartments[0] === "All") {
      setSelectedDepartments([]);
      setFranceSelected(false);
    } else {
      setFranceSelected(true);
      setSelectedDepartments(["All"]);
    }
  };

  const onDropdownElementClick = (element: string) => {
    var departments: string[] = [];
    if (selectedDepartments.length > 0 && selectedDepartments[0] === "All") { // All selected
      departments = [element];
    } else { // element selected
      departments = (selectedDepartments || []).concat(element);
    }
    setSelectedDepartments(departments);
    setDepartments([]);
    setDepartmentInput("");
    setFranceSelected(false);
  };

  const onValidate = () => {
    props.validateDepartments(selectedDepartments);
    props.hideModal();
  };

  return (
    <Modal
      show={props.show}
      className={styles.modal}
    >
      <div onClick={props.hideModal} className={styles.close}>
        <EVAIcon name="close-outline" fill="#3D3D3D" size="large" />
      </div>
      <div id="svgContainer" />
      <h1>Zone d&apos;action</h1>
      <p>
        Sélectionnez les départements sur lesquels votre dispositif est actif :
      </p>
      {!isFranceSelected && (
        <div className={styles.department}>
          {selectedDepartments &&
            selectedDepartments.length > 0 &&
            selectedDepartments.map((department) => (
              <div key={department} className={styles.selected}>
                {department}
                <div style={{ cursor: "pointer" }}>
                  <EVAIcon
                    name="close"
                    fill={"#ffffff"}
                    className="ml-10"
                    onClick={() => removeDropdowElement(department)}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
      {selectedDepartments && selectedDepartments.length < 13 && (
        <div style={{ width: "280px", marginRight: "8px" }}>
          <FInput
            id="department"
            value={departmentInput}
            onChange={onDepartmentChange}
            newSize={true}
            placeholder="Entrez un numéro de département"
            type="number"
            prepend
            prependName="hash"
            autoFocus={false}
          />
          <CustomDropDown
            elementList={departments}
            onDropdownElementClick={onDropdownElementClick}
          />
        </div>
      )}
      {selectedDepartments && selectedDepartments.length === 13 && (
        <div className={styles.help}>
          <p className={styles.description}>
            Nombre maximum de départements renseignés. Préférez l’option{" "}
            <b>France entière</b> si votre dispositif est présent sur de
            nombreux territoires.
          </p>
        </div>
      )}
      <div className={styles.title}>OU</div>
      <p>
        Votre dispositif est accessible sur tout le territoire, cochez l’option
        ci-dessous :{" "}
      </p>
      <div
        className={styles.checkbox}
        onClick={handleCheckboxChange}
        style={{ backgroundColor: isFranceSelected ? "#DEF7C2" : "#f2f2f2" }}
      >
        <CustomCheckBox checked={!!isFranceSelected} />
        <p className={isFranceSelected ? styles.text_checked : styles.text}>
          France entière
        </p>
      </div>

      <div className={styles.btn_group}>
        <FButton
          type="tuto"
          name={"play-circle-outline"}
          onClick={() => props.toggleTutorielModal("C'est pour qui ?")}
        >
          Tutoriel
        </FButton>
        <div className={styles.right}>
          <FButton
            type="validate"
            name="checkmark"
            onClick={onValidate}
            disabled={selectedDepartments.length === 0}
          >
            <span className={styles.btn_text}>Valider</span>
          </FButton>
        </div>
      </div>
    </Modal>
  );
};

export default GeolocModal;
