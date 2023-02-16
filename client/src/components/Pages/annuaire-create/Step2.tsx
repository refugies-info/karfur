import React, { useState } from "react";
import styled from "styled-components";
import FInput from "components/UI/FInput/FInput";
import { Structure } from "types/interface";
import FButton from "components/UI/FButton/FButton";
import { structureTypes } from "data/structureTypes";
import { CustomDropDown } from "./CustomDropdown";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { GetStructureResponse } from "api-types";

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
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
`;

const DeleteIconContainer = styled.div`
  background: #212121;
  height: 50px;
  width: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

interface Props {
  structure: GetStructureResponse | null;
  setStructure: (arg: any) => void;
  setHasModifications: (arg: boolean) => void;
}

export const AddButton = (props: {
  onClick: Function;
  type: "site" | "type" | "second site" | "second numéro" | "numéro" | "second email" | "email";
  disabled?: boolean;
}) => (
  <FButton name="plus-circle-outline" type="dark" onClick={props.onClick} disabled={props.disabled}>
    {`Ajouter un ${props.type}`}
  </FButton>
);

export const Step2 = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [show1WebsiteInput, setshow1WebsiteInput] = useState(false);
  const [show2WebsiteInput, setshow2WebsiteInput] = useState(false);

  const websites = props.structure && props.structure.websites ? props.structure.websites : [];

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);
  const toggle1WebSiteInput = () => setshow1WebsiteInput((prevState) => !prevState);

  const toggle2WebSiteInput = () => setshow2WebsiteInput((prevState) => !prevState);

  const getWebsites = (previousWebsites: string[], id: string, value: string) => {
    if (id === "website0") {
      if (!previousWebsites || previousWebsites.length === 0 || !previousWebsites[1]) {
        return [value];
      }
      return [value, previousWebsites[1]];
    }
    return [previousWebsites[0], value];
  };

  const onWebsiteChange = (e: any) => {
    props.setHasModifications(true);
    const websites =
      props.structure && props.structure.websites
        ? getWebsites(props.structure.websites, e.target.id, e.target.value)
        : [];
    props.setStructure({ ...props.structure, websites });
  };

  const onDropdownElementClick = (element: string) => {
    const structureTypes = props.structure
      ? !props.structure.structureTypes
        ? [element]
        : props.structure.structureTypes.concat([element])
      : [];
    props.setStructure({ ...props.structure, structureTypes });
    toggleDropDown();
    props.setHasModifications(true);
  };

  const removeDropdowElement = (element: string) => {
    const structureTypes =
      props.structure && props.structure.structureTypes
        ? props.structure.structureTypes.filter((structureType) => structureType !== element)
        : [];
    props.setStructure({ ...props.structure, structureTypes });
    props.setHasModifications(true);
  };

  const availableStructureTypes = structureTypes.filter((structureType) =>
    props.structure && props.structure.structureTypes ? !props.structure.structureTypes.includes(structureType) : true
  );

  const getUpdatedWebsites = (websites: string[], index: number) =>
    websites.filter((website) => website !== websites[index]);

  const removeWebsite = (index: number) => {
    const updatedWebsites =
      props.structure && props.structure.websites ? getUpdatedWebsites(props.structure.websites, index) : [];
    props.setStructure({ ...props.structure, websites: updatedWebsites });
    setshow1WebsiteInput(false);
    setshow2WebsiteInput(false);
    props.setHasModifications(true);
  };

  const onChange = (e: any) => {
    props.setHasModifications(true);
    return props.setStructure({
      ...props.structure,
      [e.target.id]: e.target.value
    });
  };
  return (
    <MainContainer className="step2">
      <Title>Type de structure</Title>
      <div
        style={{
          marginBottom: "16px"
        }}
      >
        {props.structure && props.structure.structureTypes && props.structure.structureTypes.length > 0 && (
          <>
            <SelectedContainer>
              {props.structure.structureTypes[0]}
              <div style={{ cursor: "pointer" }}>
                <EVAIcon
                  name="close"
                  fill={"#ffffff"}
                  className="ms-2"
                  onClick={() =>
                    removeDropdowElement(
                      props.structure && props.structure.structureTypes ? props.structure.structureTypes[0] : ""
                    )
                  }
                />
              </div>
            </SelectedContainer>
            {props.structure.structureTypes.length === 1 ? (
              <div>
                <AddButton onClick={toggleDropDown} type="type" />
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
                    className="ms-2"
                    onClick={() =>
                      removeDropdowElement(
                        props.structure && props.structure.structureTypes ? props.structure.structureTypes[1] : ""
                      )
                    }
                  />
                </div>
              </SelectedContainer>
            )}
          </>
        )}
        {props.structure && (!props.structure.structureTypes || props.structure.structureTypes.length === 0) && (
          <>
            <AddButton onClick={toggleDropDown} type="type" />
            {dropdownOpen && (
              <CustomDropDown elementList={availableStructureTypes} onDropdownElementClick={onDropdownElementClick} />
            )}
          </>
        )}
      </div>
      <Title>Site internet de votre structure</Title>
      <div style={{ marginBottom: "16px" }}>
        {(websites.length > 0 || show1WebsiteInput) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              <div
                style={{
                  width: "300px",
                  marginRight: "4px"
                }}
              >
                <FInput
                  autoFocus={false}
                  id="website0"
                  value={websites && websites[0]}
                  onChange={onWebsiteChange}
                  newSize={true}
                  placeholder="Votre site internet"
                />
              </div>
              <DeleteIconContainer onClick={() => removeWebsite(0)}>
                <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
              </DeleteIconContainer>
            </div>
            {websites.length < 2 && !show2WebsiteInput && (
              <AddButton type="second site" onClick={toggle2WebSiteInput} disabled={!websites[0]} />
            )}
          </>
        )}
        {(websites.length === 2 || show2WebsiteInput) && (
          <div
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div style={{ width: "300px", marginRight: "4px" }}>
              <FInput
                autoFocus={false}
                id="website1"
                value={websites && websites[1]}
                onChange={onWebsiteChange}
                newSize={true}
                placeholder="Votre site internet"
              />
            </div>
            <DeleteIconContainer onClick={() => removeWebsite(1)}>
              <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
            </DeleteIconContainer>
          </div>
        )}
        {websites.length === 0 && !show1WebsiteInput && <AddButton type="site" onClick={toggle1WebSiteInput} />}
      </div>
      <Title>Lien vers le profil Twitter</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "240px"
        }}
      >
        <FInput
          autoFocus={false}
          id="twitter"
          value={props?.structure?.twitter || undefined}
          onChange={onChange}
          newSize={true}
          placeholder="Votre twitter"
        />
      </div>
      <Title>Lien vers la page Facebook</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "240px"
        }}
      >
        <FInput
          autoFocus={false}
          id="facebook"
          value={props?.structure?.facebook || undefined}
          onChange={onChange}
          newSize={true}
          placeholder="Votre page Facebook"
        />
      </div>
      <Title>Lien vers le profil Linkedin</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "240px"
        }}
      >
        <FInput
          autoFocus={false}
          id="linkedin"
          value={props?.structure?.linkedin || undefined}
          onChange={onChange}
          newSize={true}
          placeholder="Votre profil Linkedin"
        />
      </div>
    </MainContainer>
  );
};
