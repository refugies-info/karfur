import { FavoritesContainer } from "./SubComponents";
import React from "react";
import { TitleWithNumber } from "../../middleOfficeSharedComponents";
import styled from "styled-components";
import FButton from "../../../../components/FigmaUI/FButton/FButton";

const CardsContainer = styled.div`
  display: felx;
  flex-direction: row;
`;

const HelpCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 13px;
  width: 248px;
  height: 248px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #2d9cdb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 8px;
  margin-left: 8px;
`;

const EmptyCardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 248px;
  height: 248px;
  margin-right: 8px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GrayLine = styled.div`
  background: #c6c6c6;
  border-radius: 8px;
  width: ${(props) => props.width};
  height: 28px;
  margin-bottom: 8px;
`;

const SmallGrayLine = styled.div`
  background: #c6c6c6;
  border-radius: 3px;
  width: ${(props) => props.width};
  height: 14px;
  margin-bottom: 5px;
  margin-left: 13px;
`;

const BottomContainer = styled.div`
  background: #c6c6c6;
  height: 50px;
  width: 100%;
  border-radius: 0px 0px 12px 12px;
  margin-top: 16px;
  padding-top: 18px;
  padding-left: 50px;
`;

const WhiteContainer = styled.div`
  background: #ffffff;
  border-radius: 3px;
  width: 180px;
  height: 14px;
`;

const EmptyCard = () => (
  <EmptyCardContainer>
    <div style={{ padding: "13px" }}>
      <GrayLine width={"221px"} />
      <GrayLine width={"130px"} />
    </div>
    <div>
      <SmallGrayLine width={"221px"} />
      <SmallGrayLine width={"200px"} />
      <SmallGrayLine width={"221px"} />
      <SmallGrayLine width={"180px"} />
      <BottomContainer>
        <WhiteContainer />
      </BottomContainer>
    </div>
  </EmptyCardContainer>
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const NoFavorites = (props: { t: any; toggleTutoModal: () => void }) => (
  <FavoritesContainer>
    <TitleWithNumber
      amount={0}
      textSingular={props.t(
        "UserFavorites.fiches sauvegardée",
        "fiches sauvegardée"
      )}
      textPlural={props.t(
        "UserFavorites.fiches sauvegardées",
        "fiches sauvegardées"
      )}
    />
    <CardsContainer>
      <HelpCard>
        {props.t(
          "UserFavorites.Comment ajouter",
          "Comment ajouter des fiches en favoris ?"
        )}
        <FButton
          type="tuto"
          name={"video"}
          className="mr-10"
          onClick={props.toggleTutoModal}
        >
          {props.t("UserFavorites.Voir la vidéo", "Voir la vidéo")}
        </FButton>
      </HelpCard>
      <EmptyCard />
      <EmptyCard />
      <EmptyCard />
    </CardsContainer>
  </FavoritesContainer>
);
