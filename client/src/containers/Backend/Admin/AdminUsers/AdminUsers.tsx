/* eslint-disable no-console */
// @ts-nocheck
import marioProfile from "assets/mario-profile.jpg";
import React, { useEffect } from "react";
import moment from "moment/min/moment-with-locales";
import styled from "styled-components";
import {
  SearchBarContainer,
  StyledHeader,
  StyledTitle,
  FigureContainer,
  StyledSort,
  Content,
} from "../sharedComponents/StyledAdmin";
import { userHeaders } from "./data";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import {
  fetchAllUsersActionsCreator,
  setAllUsersActionsCreator,
} from "../../../../services/AllUsers/allUsers.actions";
import { activeUsersSelector } from "../../../../services/AllUsers/allUsers.selector";
import { TabHeader } from "../sharedComponents/SubComponents";
import {
  RowContainer,
  StructureName,
  ResponsableComponent,
} from "../AdminStructures/components/AdminStructureComponents";
import "./AdminUsers.scss";
import { Role } from "./ components/AdminUsersComponents";
// import { correspondingStatus } from "../AdminContenu/data";

// import { compare } from "../AdminContenu/AdminContenu";

// import { FilterButton, TabHeader } from "../sharedComponents/SubComponents";

// import { filter } from "lodash";

// import { Table } from "reactstrap";

// import { headers } from "../AdminStructures/data";

// import {
//   RowContainer,
//   StructureName,
//   ResponsableComponent,
// } from "../AdminStructures/components/AdminStructureComponents";

// import { StructureDetailsModal } from "../AdminStructures/StructureDetailsModal/StructureDetailsModal";

// import { fetchAllStructuresActionsCreator } from "../../../../services/AllStructures/allStructures.actions";

// import { NewStructureModal } from "../AdminStructures/NewStructureModal/NewStructureModal";

// import { SelectFirstResponsableModal } from "../AdminStructures/SelectFirstResponsableModal/SelectFirstResponsableModal";

moment.locale("fr");
declare const window: Window;

const RoleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export const AdminUsers = () => {
  //   const defaultSortedHeader = {
  //     name: "none",
  //     sens: "none",
  //     orderColumn: "none",
  //   };

  //   const [filter, setFilter] = useState("En attente");
  //   const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  //   const [search, setSearch] = useState("");
  //   const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(
  //     false
  //   );
  //   const [showNewStructureModal, setShowNewStructureModal] = useState(false);

  //   const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  //   const [
  //     selectedStructure,
  //     setSelectedStructure,
  //   ] = useState<SimplifiedStructureForAdmin | null>(null);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS)
  );

  //   const handleChange = (e: any) => setSearch(e.target.value);

  //   const toggleShowNewStructureModal = () =>
  //     setShowNewStructureModal(!showNewStructureModal);

  //   const toggleStructureDetailsModal = () =>
  //     setShowStructureDetailsModal(!showStructureDetailsModal);

  //   const addNewStructure = () => {
  //     toggleShowNewStructureModal();
  //   };

  //   const setSelectedStructureAndToggleModal = (
  //     element: SimplifiedStructureForAdmin | null
  //   ) => {
  //     setSelectedStructure(element);
  //     toggleStructureDetailsModal();
  //   };

  //   const onFilterClick = (status: string) => {
  //     setFilter(status);
  //     setSortedHeader(defaultSortedHeader);
  //   };
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      await dispatch(fetchAllUsersActionsCreator());
    };
    loadUsers();

    return () => {
      dispatch(setAllUsersActionsCreator([]));
    };
  }, [dispatch]);

  const users = useSelector(activeUsersSelector);

  if (isLoading || users.length === 0) {
    return (
      <div>
        {/* <LoadingAdminStructures /> */}
        loading
      </div>
    );
  }

  console.log(
    "test",
    users.filter((user) => user.roles.includes("ExpertTrad"))
  );
  //   const reorder = (element: { name: string; order: string }) => {
  //     if (sortedHeader.name === element.name) {
  //       const sens = sortedHeader.sens === "up" ? "down" : "up";
  //       setSortedHeader({ name: element.name, sens, orderColumn: element.order });
  //     } else {
  //       setSortedHeader({
  //         name: element.name,
  //         sens: "up",
  //         orderColumn: element.order,
  //       });
  //     }
  //   };

  //   const filterAndSortStructures = (
  //     structures: SimplifiedStructureForAdmin[]
  //   ) => {
  //     const structuresFilteredBySearch = !!search
  //       ? structures.filter(
  //           (structure) =>
  //             structure.nom &&
  //             structure.nom
  //               .normalize("NFD")
  //               .replace(/[\u0300-\u036f]/g, "")
  //               .toLowerCase()
  //               .includes(search.toLowerCase())
  //         )
  //       : structures;

  //     const filteredStructures = structuresFilteredBySearch.filter(
  //       (structure) => structure.status === filter
  //     );
  //     if (sortedHeader.name === "none")
  //       return {
  //         structuresToDisplay: filteredStructures,
  //         structuresForCount: structuresFilteredBySearch,
  //       };

  //     const structuresToDisplay = filteredStructures.sort(
  //       (a: SimplifiedStructureForAdmin, b: SimplifiedStructureForAdmin) => {
  //         // @ts-ignore
  //         const orderColumn:
  //           | "nom"
  //           | "status"
  //           | "nbMembres"
  //           | "responsable"
  //           | "nbFiches"
  //           | "created_at" = sortedHeader.orderColumn;

  //         if (orderColumn === "nbMembres") {
  //           if (a[orderColumn] > b[orderColumn])
  //             return sortedHeader.sens === "up" ? 1 : -1;
  //           return sortedHeader.sens === "up" ? -1 : 1;
  //         }

  //         if (orderColumn === "nbFiches") {
  //           const nbFichesA = a.nbFiches;
  //           const nbFichesB = b.nbFiches;

  //           if (nbFichesA > nbFichesB) return sortedHeader.sens === "up" ? 1 : -1;
  //           return sortedHeader.sens === "up" ? -1 : 1;
  //         }

  //         if (orderColumn === "responsable") {
  //           const respoA =
  //             a.responsable && a.responsable.username
  //               ? a.responsable.username.toLowerCase()
  //               : "";
  //           const respoB =
  //             b.responsable && b.responsable.username
  //               ? b.responsable.username.toLowerCase()
  //               : "";

  //           if (respoA > respoB) return sortedHeader.sens === "up" ? 1 : -1;
  //           return sortedHeader.sens === "up" ? -1 : 1;
  //         }

  //         if (orderColumn === "created_at") {
  //           if (moment(a.created_at).diff(moment(b.created_at)) > 0)
  //             return sortedHeader.sens === "up" ? 1 : -1;
  //           return sortedHeader.sens === "up" ? -1 : 1;
  //         }

  //         const valueA = a[orderColumn] ? a[orderColumn].toLowerCase() : "";
  //         const valueAWithoutAccent = valueA
  //           .normalize("NFD")
  //           .replace(/[\u0300-\u036f]/g, "");
  //         const valueB = b[orderColumn] ? b[orderColumn].toLowerCase() : "";
  //         const valueBWithoutAccent = valueB
  //           .normalize("NFD")
  //           .replace(/[\u0300-\u036f]/g, "");
  //         if (valueAWithoutAccent > valueBWithoutAccent)
  //           return sortedHeader.sens === "up" ? 1 : -1;

  //         return sortedHeader.sens === "up" ? -1 : 1;
  //       }
  //     );
  //     return {
  //       structuresToDisplay,
  //       structuresForCount: structuresFilteredBySearch,
  //     };
  //   };

  //   const getNbStructuresByStatus = (
  //     structures: SimplifiedStructureForAdmin[],
  //     status: string
  //   ) =>
  //     structures && structures.length > 0
  //       ? structures.filter((structure) => structure.status === status).length
  //       : 0;

  //   const { structuresToDisplay, structuresForCount } = filterAndSortStructures(
  //     structures
  //   );

  //   const nbNonDeletedStructures = structures.filter(
  //     (structure) => structure.status !== "Supprimé"
  //   ).length;

  return (
    <div className="admin-users">
      <SearchBarContainer>
        {/* <CustomSearchBar
        //   value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher une structure..."
        /> */}
      </SearchBarContainer>
      <StyledHeader>
        <StyledTitle>Utilisateurs</StyledTitle>
        <FigureContainer>{users.length}</FigureContainer>

        <StyledSort marginTop="16px">
          {/* {correspondingStatus.sort(compare).map((element) => {
            // const status = element.status;
            // const nbStructures = getNbStructuresByStatus(
            //   structuresForCount,
            //   status
            // );
            return (
              <FilterButton
                key={status}
                // onClick={() => onFilterClick(status)}
                text={`${status} (${0})`}
                isSelected={filter === status}
              />
            );
          })} */}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {userHeaders.map((element, key) => (
                <th
                  key={key}
                  //   onClick={() => {
                  //     reorder(element);
                  //   }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    // isSortedHeader={sortedHeader.name === element.name}
                    // sens={
                    //   sortedHeader.name === element.name
                    //     ? sortedHeader.sens
                    //     : "down"
                    // }
                    isSortedHeader={false}
                    sens={"up"}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((element, key) => {
              const secureUrl =
                element && element.picture && element.picture.secure_url
                  ? element.picture.secure_url
                  : marioProfile;
              return (
                <tr
                  key={key}
                  // onClick={() => setSelectedStructureAndToggleModal(element)}
                >
                  <td className="align-middle">
                    <RowContainer>
                      <img className="user-img mr-8" src={secureUrl} />
                      <StructureName>{element.username}</StructureName>
                    </RowContainer>
                  </td>
                  <td className="align-middle">{element.email}</td>

                  <td className={"align-middle "}>
                    {element.structure
                      ? element.structure.nom
                      : "Pas de structure"}
                  </td>
                  <td className="align-middle">{element.nbStructures}</td>
                  <td className="align-middle">
                    <RoleContainer>
                      {element.roles.map((role) => (
                        <Role key={role} role={role} />
                      ))}
                    </RoleContainer>
                  </td>
                  <td className="align-middle">langues</td>

                  <td className="align-middle">
                    {element.created_at
                      ? moment(element.created_at).format("LLL")
                      : "Non connue"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
    </div>
  );
};
