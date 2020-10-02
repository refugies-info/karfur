import React, { useState } from "react";
import styled from "styled-components";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { Structure } from "../../../../../@types/interface";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { StructureTypes } from "../../data";
import { CustomDropDown } from "../../CustomDropdown/CustomDropdown";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";

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

const SelectedContainer = styled.div`
  background: #8bc34a;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  padding: 15px;
  width: fit-content;
  heigth: 50px;
  margin-right: 8px;
  display: flex;
  flex-direction: row;
`;

interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

const AddButton = (props: { onClick: Function }) => (
  <FButton name="plus-circle-outline" type="dark" onClick={props.onClick}>
    Ajouter un type
  </FButton>
);

export const Step2 = (props: Props) => {
  const onChange = (e: any) =>
    props.setStructure({ ...props.structure, [e.target.id]: e.target.value });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  //   const websites = props.structure ? props.structure.websites : [];

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);
  const onDropdownElementClick = (element: string) => {
    const structureTypes = props.structure
      ? !props.structure.structureTypes
        ? [element]
        : props.structure.structureTypes.concat([element])
      : [];
    props.setStructure({ ...props.structure, structureTypes });
    toggleDropDown();
  };

  const removeDropdowElement = (element: string) => {
    const structureTypes = props.structure
      ? props.structure.structureTypes.filter(
          (structureType) => structureType !== element
        )
      : [];
    props.setStructure({ ...props.structure, structureTypes });
  };

  const availableStructureTypes = StructureTypes.filter((structureType) =>
    props.structure
      ? !props.structure.structureTypes.includes(structureType)
      : true
  );

  return (
    <MainContainer className="step2">
      <Title>Type de structure</Title>
      <div
        style={{
          marginBottom: "16px",
        }}
      >
        {/* <StructureTypeContainer> */}
        {props.structure && props.structure.structureTypes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <SelectedContainer>
              {props.structure.structureTypes[0]}
              <div style={{ cursor: "pointer" }}>
                <EVAIcon
                  name="close"
                  fill={"#ffffff"}
                  className="ml-10"
                  onClick={() =>
                    removeDropdowElement(
                      props.structure ? props.structure.structureTypes[0] : ""
                    )
                  }
                />
              </div>
            </SelectedContainer>
            {props.structure.structureTypes.length === 1 ? (
              <div>
                <AddButton onClick={toggleDropDown} />
                {dropdownOpen && (
                  <CustomDropDown
                    elementList={availableStructureTypes}
                    onDropdownElementClick={onDropdownElementClick}
                  />
                )}
              </div>
            ) : (
              <SelectedContainer>
                {props.structure.structureTypes[1]}
                <div style={{ cursor: "pointer" }}>
                  <EVAIcon
                    name="close"
                    fill={"#ffffff"}
                    className="ml-10"
                    onClick={() =>
                      removeDropdowElement(
                        props.structure ? props.structure.structureTypes[1] : ""
                      )
                    }
                  />
                </div>
              </SelectedContainer>
            )}
          </div>
        )}
        {props.structure &&
          (!props.structure.structureTypes ||
            props.structure.structureTypes.length === 0) && (
            <>
              <AddButton onClick={toggleDropDown} />
              {dropdownOpen && (
                <CustomDropDown
                  elementList={availableStructureTypes}
                  onDropdownElementClick={onDropdownElementClick}
                />
              )}
            </>
          )}
        {/* </StructureTypeContainer> */}

        {/* <ButtonDropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className="type-dropdown"
        >
          <DropdownToggle caret>Association</DropdownToggle>
          <DropdownMenu>
            {StructureTypes.map((structureType) => (
              <DropdownItem>{structureType}</DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown> */}
      </div>
      <Title>Site internet de votre structure</Title>
      <div style={{ marginBottom: "16px", width: "200px" }}>
        {/* {has0Website && <AddWebsiteButton/>} */}
        <FInput
          id="website"
          value={props.structure && props.structure.websites}
          onChange={onChange}
          newSize={true}
        />
      </div>
      <Title>Profil Twitter</Title>
      <Title>Page Facebook</Title>
      <Title>Profil Linkedin</Title>
    </MainContainer>
  );
};
