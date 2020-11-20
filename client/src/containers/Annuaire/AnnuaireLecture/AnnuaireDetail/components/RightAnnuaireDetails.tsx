import React from "react";
import styled from "styled-components";
import { Dispositif } from "../../../../../@types/interface";
import { ObjectId } from "mongodb";
import SearchResultCard from "../../../../AdvancedSearch/SearchResultCard";

const Container = styled.div`
  width: 360px;
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
`;

const DispositifsContainer = styled.div`
  display: flex;
  flex-direction: column;
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
interface Props {
  leftPartHeight: number;
  dispositifsAssocies: ObjectId[] | Dispositif[];
  history: any;
}
export const RightAnnuaireDetails = (props: Props) => {
  // @ts-ignore
  const activeDispositifsAssocies = props.dispositifsAssocies.filter(
    (dispositif: Dispositif) => dispositif.status === "Actif"
  );
  const nbActiveDispositifs = activeDispositifsAssocies.length;
  return (
    <Container height={props.leftPartHeight}>
      <TitleContainer>
        <Title>À lire</Title>
        <FigureContainer>{nbActiveDispositifs}</FigureContainer>
      </TitleContainer>
      <DispositifsContainer>
        {activeDispositifsAssocies.map((dispositif: Dispositif) => {
          return (
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
          );
        })}
      </DispositifsContainer>
    </Container>
  );
};
