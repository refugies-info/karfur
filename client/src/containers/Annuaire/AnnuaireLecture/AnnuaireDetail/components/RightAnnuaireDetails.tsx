import React from "react";
import styled from "styled-components";
import { IDispositif } from "../../../../../types/interface";
import { ObjectId } from "mongodb";
import SearchResultCard from "../../../../AdvancedSearch/SearchResultCard";
import NoResultsBackgroundImage from "../../../../../assets/no_results.svg";
import "./RightAnnuaireDetails.scss";

const Container = styled.div`
  width: 300px;
  overflow: scroll;
  height: ${(props) => props.height}px;
  padding: 32px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  margin-right: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

// on firefox behaviour is strange with overflow, we have to add an empty container to have margin
const BottomContainer = styled.div`
  margin-top: 75px;
  width: 100%;
  height: 5px;
  color: #e5e5e5;
`;
const NoDispositifsImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  width: 223px;
  height: 158px;
  margin-top: 24px;
`;

const FigureContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(33, 33, 33, 0.25);
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  height: fit-content;
  width: fit-content;
  padding: 4px;
  color: ${(props) => (props.red ? "#F44336" : "#212121")};
`;

const DispositifsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContainer = styled.div`
  width: 248px;
  height: 248px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 24px;
  margin-left: 24px;
  z-index: 0;
`;
const NoDispositifText = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #828282;
  margin-right: 24px;
  margin-left: 24px;
`;

interface Props {
  leftPartHeight: number;
  dispositifsAssocies: ObjectId[] | IDispositif[];
  history: any;
  t: any;
}
export const RightAnnuaireDetails = (props: Props) => {
  // @ts-ignore
  const activeDispositifsAssocies = props.dispositifsAssocies.filter(
    (dispositif: IDispositif) => dispositif.status === "Actif"
  );
  const nbActiveDispositifs = activeDispositifsAssocies.length;
  return (
    <Container height={props.leftPartHeight} className="right-annuaire">
      <TitleContainer>
        <Title>{props.t("Annuaire.A lire", "À lire")}</Title>
        <FigureContainer red={nbActiveDispositifs === 0}>
          {nbActiveDispositifs}
        </FigureContainer>
      </TitleContainer>
      <DispositifsContainer>
        {nbActiveDispositifs === 0 && (
          <>
            <NoDispositifText>
              {props.t(
                "Annuaire.noDispositif",
                "Oups! Cette structure n'a pas encore rédigé de fiche."
              )}
            </NoDispositifText>
            <NoDispositifsImage />
          </>
        )}
        {nbActiveDispositifs > 0 &&
          activeDispositifsAssocies.map((dispositif: IDispositif) => (
            <CardContainer key={dispositif._id}>
              <SearchResultCard
                // @ts-ignore
                pin={() => {}}
                pinnedList={[]}
                dispositif={dispositif}
                themeList={null}
                history={props.history}
                showPinned={false}
              />
            </CardContainer>
          ))}
      </DispositifsContainer>
      <BottomContainer>s</BottomContainer>
    </Container>
  );
};
