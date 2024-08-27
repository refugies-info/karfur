import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Table } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon";
import { colors } from "~/utils/colors";
import { Content, FigureContainer, StyledHeader, StyledSort, StyledTitle } from "../../sharedComponents/StyledAdmin";
import { FilterButton } from "../../sharedComponents/SubComponents";
import { correspondingStatus, table_contenu } from "../data";

export const LoadingAdminContenu = () => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(7).fill("a");

  const compare = (a: any, b: any) => {
    const orderA = a.order;
    const orderB = b.order;
    return orderA > orderB ? 1 : -1;
  };
  return (
    <>
      <StyledHeader>
        <StyledTitle>Contenus</StyledTitle>
        <FigureContainer>{"..."}</FigureContainer>
        <StyledSort>
          {correspondingStatus.sort(compare).map((status) => (
            <FilterButton
              key={status.storedStatus}
              onClick={() => {}}
              text={`${status.adminStatus || status.displayedStatus} (...)`}
              isSelected={false}
            />
          ))}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {table_contenu.headers.map((element, key) => (
                <th key={key}>
                  {element.name}
                  {element.order && (
                    <EVAIcon
                      // @ts-ignore
                      name={"chevron-" + (element.croissant ? "up" : "down")}
                      fill={colors.gray90}
                      className="sort-btn"
                    />
                  )}
                </th>
              ))}
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
      </Content>
    </>
  );
};
