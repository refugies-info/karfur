import React from "react";
import {
  MainContainer,
  StructurePictureContainer,
  StructureContainer,
} from "./SubComponents";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { colors } from "colors";
import { TitleWithNumber } from "../../middleOfficeSharedComponents";
import styles from "./UserStructureLoading.module.scss";

export const UserStructureLoading = () => (
  <MainContainer>
    <StructurePictureContainer>
      <div className={styles.img} />
      <SkeletonTheme baseColor={colors.white}>
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
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} width={700} />
      </SkeletonTheme>
    </StructureContainer>
  </MainContainer>
);
