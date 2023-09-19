import React from "react";
import { FavoritesContainer, CardsContainer } from "./SubComponents";
import { TitleWithNumber } from "../../middleOfficeSharedComponents";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../../colors";

const LoadingCardContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  width: 248px;
  height: 248px;
  margin-right: 8px;
  margin-left: 8px;
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
  <FavoritesContainer>
    <div style={{ marginRight: "40px", marginLeft: "40px" }}>
      <TitleWithNumber
        amount={0}
        textSingular={props.t("UserFavorites.content_saved", "fiche sauvegardée")}
        textPlural={props.t("UserFavorites.contents_saved", "fiches sauvegardées")}
        isLoading={true}
      />
    </div>
    <CardsContainer>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </CardsContainer>
  </FavoritesContainer>
);
