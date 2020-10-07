import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { days } from "./data";
import { HoursDetails } from "./HoursDetails";

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
`;

const CheckboxContainer = styled.div`
  background: #f2f2f2;
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
`;

const Subtitle = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
  margin-bottom: 12px;
`;
export const Step4 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);

  const onChange = (e: any) =>
    props.setStructure({ ...props.structure, [e.target.id]: e.target.value });

  const getNewDepartmentArray = (department: number, id: string) => {
    if (!props.structure) return [];
    if (!props.structure.departments || id === "department0")
      return [department];
    return [];
    // if(id==='department0') return [de]
  };
  const onDepartmentChange = (e: any) =>
    props.setStructure({
      ...props.structure,
      departments: getNewDepartmentArray(e.target.value, e.target.id),
    });

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
      <DepartmentContainer>
        <div style={{ width: "180px", marginRight: "8px" }}>
          <FInput
            id="department0"
            value={
              props.structure &&
              props.structure.departments &&
              props.structure.departments[0]
            }
            onChange={onDepartmentChange}
            newSize={true}
            placeholder="Entrez un numéro"
            type="number"
            prepend
            prependName="hash"
          />
        </div>
        <div>
          <FButton
            name="plus-circle-outline"
            type="dark"
            // onClick={props.onClick}
            disabled={
              !props.structure || props.structure.departments.length === 0
            }
          >
            {`Ajouter un autre département`}
          </FButton>
        </div>
      </DepartmentContainer>
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
