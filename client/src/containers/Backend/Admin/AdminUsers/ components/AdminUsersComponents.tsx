import styled from "styled-components";
import React from "react";
import Image from "next/image";
import { RowContainer } from "../../AdminStructures/components/AdminStructureComponents";
import { Picture } from "types/interface";
import checkStyles from "scss/components/checkbox.module.scss";
import { cls } from "lib/classname";
interface RoleProps {
  role: string;
}

const RoleContainer = styled.div`
  background: #cdcdcd;
  border-radius: 6px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  padding: 8px;
  width: fit-content;
  margin-right: 4px;
  margin-bottom: 4px;
`;
export const Role = (props: RoleProps) => (
  <RoleContainer>{props.role}</RoleContainer>
);

interface LangueFlagProps {
  langue: string;
}

const LangueContainer = styled.div`
  padding: 8px;
  background: #cdcdcd;
  width: fit-content;
  height: fit-content;
  border-radius: 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
`;
export const LangueFlag = (props: LangueFlagProps) => (
  <LangueContainer>
    <i
      className={"flag-icon flag-icon-" + props.langue}
      title={props.langue}
      id={props.langue}
      key={props.langue}
    />
  </LangueContainer>
);

const StructureName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
  overflow: hidden;
  word-wrap: break-word;
  text-decoration: underline;
  cursor: pointer;
`;

const RoleDetail = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
`;
interface StructureProps {
  nom: string;
  picture: Picture | null;
  role: string | null;
  onClick: () => void;
}
export const Structure = (props: StructureProps) => (
  <div
    style={{
      marginTop: "4px",
      marginBottom: "12px",
    }}
  >
    <RowContainer>
      {props.picture && props.picture.secure_url && (
        <Image
          className="mr-8"
          src={props.picture.secure_url}
          alt=""
          width={40}
          height={40}
          objectFit="contain"
        />
      )}
      <StructureName onClick={props.onClick}>{props.nom}</StructureName>
      {props.role && <RoleDetail>{props.role}</RoleDetail>}
    </RowContainer>
  </div>
);

const MainContainer = styled.div`
  background: ${(props: {isSelected: boolean}) => (props.isSelected ? "#4CAF50" : "#828282")};
  border-radius: 12px;
  padding: 8px;
  width: fit-content;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  margin-right: 8px;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const Name = styled.span`
  margin-left: 30px;
`;
interface RoleCheckBoxProps {
  name: string;
  isSelected: boolean;
  handleCheckBoxChange: (arg: string) => void;
}

export const RoleCheckBox = (props: RoleCheckBoxProps) => (
  <MainContainer isSelected={props.isSelected}>
    <label className={cls(checkStyles.checkbox, checkStyles.reverse)}>
      <input
        onChange={() => props.handleCheckBoxChange(props.name)}
        type="checkbox"
        checked={props.isSelected}
      />
      <span className={checkStyles.checkmark}></span>
    </label>
    <Name>{props.name}</Name>
  </MainContainer>
);

interface LangueDetailProps {
  langue: { langueCode: string; langueFr: string };
}
export const LangueDetail = (props: LangueDetailProps) => (
  <LangueContainer>
    <div style={{ marginRight: "8px" }}>
      <i
        className={"flag-icon flag-icon-" + props.langue.langueCode}
        title={props.langue.langueCode}
        id={props.langue.langueCode}
        key={props.langue.langueCode}
      />
    </div>
    {props.langue.langueFr === "Persan" ? "Persan/Dari" : props.langue.langueFr}
  </LangueContainer>
);
