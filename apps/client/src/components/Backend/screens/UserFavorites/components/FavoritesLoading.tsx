import React from "react";
import TitleWithNumber from "components/Backend/TitleWithNumber";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { colors } from "colors";
import styles from "../UserFavorites.module.scss";

const LoadingCardContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  width: 248px;
  height: 248px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  background:${colors.gray60}
  height: 50px;
  width: 100%;
  border-radius: 0px 0px 12px 12px;
  margin-top: 16px;
  padding-top: 18px;
  padding-left: 50px;
`;

const LoadingCard = () => (
  <LoadingCardContainer>
    <div style={{ padding: "13px" }}>
      <Skeleton count={2} height="28px" />
    </div>
    <div>
      <div style={{ marginLeft: "13px", marginRight: "13px" }}>
        <Skeleton count={3} height="14px" />
      </div>
      <BottomContainer />
    </div>
  </LoadingCardContainer>
);

export const FavoritesLoading = (props: { t: any }) => (
  <div className={styles.container}>
    <div className={styles.title}>
      <TitleWithNumber
        amount={0}
        textSingular={props.t("UserFavorites.content_saved", "fiche sauvegardée")}
        textPlural={props.t("UserFavorites.contents_saved", "fiches sauvegardées")}
        isLoading={true}
      />
    </div>
    <div className={styles.cards}>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  </div>
);
