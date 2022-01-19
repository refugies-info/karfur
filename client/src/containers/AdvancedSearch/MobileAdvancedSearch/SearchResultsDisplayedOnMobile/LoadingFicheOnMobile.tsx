import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: ${(props) =>
    props.typeContenu === "demarche" ? `2px solid ${props.darkColor}` : null};
  min-height: 76px;
  margin: 13px 0;
  background-color: ${(props) =>
    props.typeContenu === "dispositif" ? colors.blanc : props.lightColor};
  border-radius: 12px;
  align-items: center;
  padding: 16px;
`;

const TitleText = styled.div`
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;
`;

const PictoCircle = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  align-items: center;
  min-width: 44px;
  height: 44px;
  background-color: ${(props) => props.color}; ;
`;

export const LoadingFicheOnMobile = () => {
  return (
    <div>
      <ItemContainer darkColor={""} typeContenu={"dispositif"} lightColor={""}>
        <TitleText color={colors.darkColor}>
          <SkeletonTheme color={colors.noirCD}>
            <Skeleton width={200} count={1} />
          </SkeletonTheme>
        </TitleText>

        <PictoCircle color={colors.noirCD}></PictoCircle>
      </ItemContainer>
    </div>
  );
};
