import React, { useEffect } from "react";
import styled from "styled-components";
import { Structure } from "../../../../@types/interface";
import img from "../../../../assets/annuaire/annuaire_create.svg";
import "./AnnuaireDetail.scss";
import { StructureType } from "../components/StructureType";
import { SocialsLink } from "../components/SocialsLink";

interface Props {
  structure: Structure;
}

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  background: red;
`;

const LeftContainer = styled.div`
  width: 360px;
  background-image: url(${img});
  //   height: 800px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 296px;
  height: 168px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
`;
export const AnnuaireDetail = (props: Props) => {
  console.log("props", props);
  useEffect(() => {
    // @ts-ignore
    window.scrollTo(0, 175);
  }, []);

  return (
    <Content className="annuaire-detail">
      <LeftContainer>
        <div>
          <LogoContainer>
            <img
              className="sponsor-img"
              src={(props.structure.picture || {}).secure_url}
              alt={props.structure.acronyme}
            />
          </LogoContainer>
          {props.structure.structureTypes.map((structureType) => (
            <StructureType type={structureType} />
          ))}
        </div>
        <SocialsLink
          websites={props.structure.websites}
          facebook={props.structure.facebook}
          linkedin={props.structure.linkedin}
          twitter={props.structure.twitter}
        />
      </LeftContainer>
      HElo
    </Content>
  );
};
