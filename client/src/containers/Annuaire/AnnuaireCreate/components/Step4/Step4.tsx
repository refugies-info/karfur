import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { days, departmentsData } from "./data";
import { HoursDetails } from "./HoursDetails";
import { CustomDropDown } from "../../CustomDropdown/CustomDropdown";
import { CustomCheckBox } from "../CustomCheckBox/CustomCheckBox";

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 24px;
`;

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
  padding: 16px;
  margin-bottom: 24px;
  position: relative;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

const DepartmentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CheckboxContainer = styled.div`
  background: ${(props) => (props.checked ? "#DEF7C2" : "#f2f2f2")};
  border-radius: 12px;
  width: fit-content;
  padding: 14px;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const SelectedContainer = styled.div`
  background: #8bc34a;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  padding: 15px;
  width: fit-content;
  heigth: 50px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  margin-right: 8px;
`;

export const Step4 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [departmentInput, setDepartmentInput] = useState("");

  const onDepartmentChange = (e: any) => {
    setDepartmentInput(e.target.value);
    if (e.target.value === "") {
      return setDepartments([]);
    }
    const departmentsDataFiltered = departmentsData.filter((department) =>
      props.structure
        ? !props.structure.departments.includes(department)
        : false
    );

    const filteredDepartments = departmentsDataFiltered.filter((department) =>
      department.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // @ts-ignore
    setDepartments(filteredDepartments);
  };

  const removeDropdowElement = (element: string) => {
    const departments = props.structure
      ? props.structure.departments.filter(
          (department) => department !== element
        )
      : [];
    props.setStructure({ ...props.structure, departments });
  };

  const handleCheckboxChange = () => {
    if (
      props.structure &&
      props.structure.departments &&
      props.structure.departments[0] === "All"
    ) {
      return props.setStructure({
        ...props.structure,
        departments: [],
      });
    }
    return props.setStructure({
      ...props.structure,
      departments: ["All"],
    });
  };

  const onDropdownElementClick = (element: string) => {
    const departments = props.structure
      ? !props.structure.departments
        ? [element]
        : props.structure.departments.concat([element])
      : [];
    props.setStructure({ ...props.structure, departments });
    setDepartments([]);
    setDepartmentInput("");
  };

  const isFranceSelected =
    !!props.structure && props.structure.departments[0] === "All";
  return (
    <MainContainer>
      <Title>Départements d'action</Title>
      {showHelp && (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpDescription>
            Si votre structure est présente sur beaucoup de départements, cochez
            le choix “France entière” puis créez une structure pour chacune de
            vos antennes territoriales.
          </HelpDescription>
        </HelpContainer>
      )}
      {!isFranceSelected && (
        <DepartmentContainer>
          {props.structure &&
            props.structure.departments &&
            props.structure.departments.length > 0 &&
            props.structure.departments.map((department) => (
              <SelectedContainer>
                {department}
                <div style={{ cursor: "pointer" }}>
                  <EVAIcon
                    name="close"
                    fill={"#ffffff"}
                    className="ml-10"
                    onClick={() => removeDropdowElement(department)}
                  />
                </div>
              </SelectedContainer>
            ))}
          {props.structure && props.structure.departments.length < 8 && (
            <div style={{ width: "180px", marginRight: "8px" }}>
              <FInput
                id="department0"
                value={departmentInput}
                onChange={onDepartmentChange}
                newSize={true}
                placeholder="Entrez un numéro"
                type="number"
                prepend
                prependName="hash"
              />
              <CustomDropDown
                elementList={departments}
                onDropdownElementClick={onDropdownElementClick}
              />
            </div>
          )}
        </DepartmentContainer>
      )}
      <CheckboxContainer
        onClick={handleCheckboxChange}
        checked={isFranceSelected}
      >
        <CustomCheckBox checked={isFranceSelected} />
        France entière
      </CheckboxContainer>
      <Title>Numéro de télephone</Title>
      <Title>Adresse postale</Title>
      <Title>Horaires d'accueil du public</Title>
      <CheckboxContainer onClick={handleCheckboxChange}>
        <input
          onChange={handleCheckboxChange}
          type="checkbox"
          checked={
            !!props.structure &&
            !!props.structure.departments &&
            props.structure.departments[0] === "All"
          }
          className="mr-8"
        />
        Notre structure n'accueille pas de public.
      </CheckboxContainer>
      <Subtitle>Cochez ou décochez les jours d'ouverture :</Subtitle>
      {days.map((day) => (
        <HoursDetails day={day} />
      ))}
    </MainContainer>
  );
};
