import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Structure, Picture } from "types/interface";
import { StructureType } from "./StructureType";
import { SocialsLink } from "./SocialsLink";
import img from "assets/annuaire/illu_annuaire_big.svg";
import placeholder from "assets/annuaire/placeholder_logo_annuaire.svg";
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

const Image = styled.img`
width: 100%;
align-self: center;
object-fit: contain;
max-height: 150px;
`;

interface Props {
  structure: Structure | null;
  leftPartHeight: number;
  isLoading: boolean;
}

export const LeftAnnuaireDetail = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;

    return placeholder;
  };

  const onClickGoBack = () => {
    /* if (props.history.location.state === "from_annuaire_lecture") {
      // props.history.go(-1);
    } else { */
      router.push("/annuaire");
    // }
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
            {t("Annuaire.Retour à l'annuaire", "Retour à l'annuaire")}
          </FButton>
        </div>
        <div>
          <LogoContainer>
            <Image
              src={getSecureUrl(props.structure.picture)}
              alt={props.structure.acronyme}
            />
          </LogoContainer>
          {props.structure.structureTypes &&
            props.structure.structureTypes.map((structureType) => (
              <StructureType
                type={structureType}
                key={structureType}
              />
            ))}
        </div>
        <SocialsLink
          websites={props.structure.websites}
          facebook={props.structure.facebook}
          linkedin={props.structure.linkedin}
          twitter={props.structure.twitter}
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
