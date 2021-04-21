import React from "react";
import {
  MainContainer,
  StructurePictureContainer,
  StructureContainer,
} from "./SubComponents";
import styled from "styled-components";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { colors } from "../../../../colors";
import { TitleWithNumber } from "../../middleOfficeSharedComponents";

const ImageContainer = styled.div`
  width: 160px;
  height: 160px;
  background-color: ${colors.blancSimple};
  margin-bottom: 8px;
`;
export const UserStructureLoading = () => (
  <MainContainer>
    <StructurePictureContainer>
      <ImageContainer />
      <SkeletonTheme color={colors.blancSimple}>
        <Skeleton count={1} height={20} width={160} />
      </SkeletonTheme>
    </StructurePictureContainer>
    <StructureContainer>
      <TitleWithNumber
        isLoading={true}
        textBefore={"Membres"}
        textPlural=""
        textSingular=""
        amount={0}
      />
      <SkeletonTheme color={colors.blancSimple}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
      <SkeletonTheme color={colors.blancSimple}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
      <SkeletonTheme color={colors.blancSimple}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
    </StructureContainer>
  </MainContainer>
);
