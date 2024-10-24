import { TraductionsStatus } from "@refugies-info/api-types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Table } from "reactstrap";
import styled from "styled-components";
import CustomSearchBar from "~/components/UI/CustomSeachBar";
import FButton from "~/components/UI/FButton";
import { colors } from "~/utils/colors";
import { FilterButton } from "./SubComponents";

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MainContainer = styled.div`
  margin: 26px 80px 30px 80px;
  width: fit-content;
  align-self: center;
`;

const FilterBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
`;

const TableContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 32px;
`;

interface Props {
  toggleTutoModal: () => void;
}
export const LoadingDispositifsWithTranslationsStatus = (props: Props) => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(5).fill("a");

  const headers = ["Type", "Titre", "Progression", "Mots", "Depuis", "Statut", "Dernière trad"];

  return (
    <MainContainer>
      <RowContainer>
        <Row>
          <SkeletonTheme baseColor={colors.white}>
            <Skeleton width={120} height={50} count={1} />
          </SkeletonTheme>
        </Row>
        <Row>
          <FButton type="tuto" onClick={props.toggleTutoModal} name="video-outline" className="me-2">
            Explications
          </FButton>
          <FButton type="dark" name="settings-2-outline">
            Mes langues
          </FButton>
        </Row>
      </RowContainer>
      <FilterBarContainer>
        <Row>
          <FilterButton
            status={TraductionsStatus.TO_TRANSLATE}
            isSelected={false}
            nbContent={"..."}
            onClick={() => {}}
          />

          <FilterButton status={TraductionsStatus.VALIDATED} isSelected={false} nbContent={"..."} onClick={() => {}} />
          <FilterButton isSelected={true} name="Dispositifs" onClick={() => {}} nbContent={"..."} />
          <FilterButton isSelected={false} name="Démarches" onClick={() => {}} nbContent={"..."} />
        </Row>

        <CustomSearchBar
          value={""}
          // @ts-ignore
          onChange={() => {}}
          placeholder="Rechercher..."
          withMargin={false}
        />
      </FilterBarContainer>
      <TableContainer>
        <Table responsive borderless className="avancement-table">
          <thead>
            <tr className="tr-test">
              {headers.map((element, key) => {
                return <th key={key}>{element}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((_, key) => {
              return (
                <tr key={key} className={"bg-white"}>
                  <td>
                    <SkeletonTheme baseColor="#CDCDCD">
                      <Skeleton width={50} count={1} />
                    </SkeletonTheme>
                  </td>
                  <td>
                    <SkeletonTheme baseColor="#CDCDCD">
                      <Skeleton width={270} count={1} />
                    </SkeletonTheme>
                  </td>
                  {arrayContent.map((_, key) => (
                    <td key={key}>
                      <SkeletonTheme baseColor="#CDCDCD">
                        <Skeleton width={70} count={1} />
                      </SkeletonTheme>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </MainContainer>
  );
};
