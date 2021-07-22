import React from "react";
import { Structure, Picture } from "../../../../../types/interface";
import img from "../../../../../assets/annuaire/illu_annuaire_big.svg";
import styled from "styled-components";
import { StructureType } from "./StructureType";
import { SocialsLink } from "./SocialsLink";
import placeholder from "../../../../../assets/annuaire/placeholder_logo_annuaire.svg";
import FButton from "components/FigmaUI/FButton/FButton";

const LeftContainer = styled.div`
  width: 390px;
  background-image: url(${img});
  background-repeat: no-repeat;
  background-size: cover;
  padding: 44px;
  display: flex;
  padding-top: 100px;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 296px;
  height: 168px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  padding: 32px;
`;

interface Props {
  structure: Structure | null;
  leftPartHeight: number;
  t: any;
  isLoading: boolean;
  history: any;
}

export const LeftAnnuaireDetail = (props: Props) => {
  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;

    return placeholder;
  };

  const onClickGoBack = () => {
    if (props.history.location.state === "from_annuaire_lecture") {
      props.history.go(-1);
    } else {
      props.history.push("/annuaire");
    }
  };
  if (props.structure && !props.isLoading) {
    return (
      <LeftContainer height={props.leftPartHeight}>
        <div style={{ marginBottom: "33px" }}>
          <FButton
            type="login"
            name="arrow-back-outline"
            onClick={onClickGoBack}
          >
            {props.t("Annuaire.Retour à l'annuaire", "Retour à l'annuaire")}
          </FButton>
        </div>
        <div>
          <LogoContainer>
            <img
              className="sponsor-img"
              src={getSecureUrl(props.structure.picture)}
              alt={props.structure.acronyme}
            />
          </LogoContainer>
          {props.structure.structureTypes &&
            props.structure.structureTypes.map((structureType) => (
              <StructureType
                type={structureType}
                key={structureType}
                t={props.t}
              />
            ))}
        </div>
        <SocialsLink
          websites={props.structure.websites}
          facebook={props.structure.facebook}
          linkedin={props.structure.linkedin}
          twitter={props.structure.twitter}
          t={props.t}
        />
      </LeftContainer>
    );
  }

  return (
    <LeftContainer height={props.leftPartHeight}>
      <div>
        <LogoContainer></LogoContainer>
      </div>
    </LeftContainer>
  );
};
