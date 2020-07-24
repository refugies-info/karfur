import React from "react";
import EVAIcon from "../UI/EVAIcon/EVAIcon";
// @ts-ignore
import variables from "scss/colors.scss";
import styled from "styled-components";

interface Props {
  acronyme: string | undefined;
  nom: string | undefined;
  alt: string | undefined;
}

const StyledContainer = styled.div`
  background: #f2f2f2;
  border-radius: 12px;
  font-weight: bold;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;

export const NoSponsorImage = (props: Props) => (
  <StyledContainer>
    <EVAIcon
      name="image-outline"
      className="not-exist-icon mr-16"
      size="large"
      fill={variables.noir}
    />
    <span>
      {props.acronyme || props.nom
        ? (props.acronyme || "") +
          (props.acronyme && props.nom ? " - " : "") +
          (props.nom || "")
        : props.alt || "Structure 1"}
    </span>
  </StyledContainer>
);
