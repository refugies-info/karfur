// /* eslint-disable no-console */
// // @ts-nocheck
import marioProfile from "assets/mario-profile.jpg";
import React, { useState } from "react";
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
import { userHeaders, correspondingStatus } from "./data";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "../../../../services/AllUsers/allUsers.selector";
import { TabHeader, FilterButton } from "../sharedComponents/SubComponents";
import {
  RowContainer,
  StructureName,
} from "../AdminStructures/components/AdminStructureComponents";
import "./AdminUsers.scss";
import { Role, LangueFlag } from "./ components/AdminUsersComponents";
import { LoadingAdminUsers } from "./ components/LoadingAdminUsers";
// import { correspondingStatus } from "../AdminContenu/data";

import { compare } from "../AdminContenu/AdminContenu";

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
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import { SimplifiedUser } from "../../../../types/interface";

moment.locale("fr");
declare const window: Window;

const RoleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 150px;
`;

const LangueContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 150px;
`;

export const AdminUsers = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };

  const [filter, setFilter] = useState("Admin");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");
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

  const handleChange = (e: any) => setSearch(e.target.value);

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

  const onFilterClick = (status: string) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const users = useSelector(activeUsersSelector);

  const reorder = (element: { name: string; order: string }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, orderColumn: element.order });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        orderColumn: element.order,
      });
    }
  };
  const filterAndSortUsers = (users: SimplifiedUser[]) => {
    const usersFilteredBySearch = !!search
      ? users.filter(
          (user) =>
            user.username &&
            user.username
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      : users;

    let filteredUsers = usersFilteredBySearch;
    if (filter === "Admin") {
      filteredUsers = usersFilteredBySearch.filter((user) =>
        user.roles.includes("Admin")
      );
    } else if (filter === "Respo") {
      filteredUsers = usersFilteredBySearch.filter((user) =>
        user.roles.includes("Responsable")
      );
    } else if (filter === "Experts") {
      filteredUsers = usersFilteredBySearch.filter((user) =>
        user.roles.includes("ExpertTrad")
      );
    } else if (filter === "Traducteurs") {
      filteredUsers = usersFilteredBySearch.filter(
        (user) => user.langues && user.langues.length > 0
      );
    } else if (filter === "Rédacteurs") {
      filteredUsers = usersFilteredBySearch.filter((user) =>
        user.roles.includes("Rédacteur")
      );
    } else if (filter === "Multi-structure") {
      filteredUsers = usersFilteredBySearch.filter(
        (user) => user.nbStructures > 1
      );
    }

    if (sortedHeader.name === "none")
      return {
        usersToDisplay: filteredUsers,
        usersForCount: usersFilteredBySearch,
      };

    const usersToDisplay = filteredUsers.sort(
      (a: SimplifiedUser, b: SimplifiedUser) => {
        // @ts-ignore
        const orderColumn: "pseudo" | "email" | "structure" | "created_at" =
          sortedHeader.orderColumn;

        if (orderColumn === "structure") {
          const structureA =
            a.structure && a.structure.nom ? a.structure.nom : "";
          const structureB =
            b.structure && b.structure.nom ? b.structure.nom : "";

          if (structureA > structureB)
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "created_at") {
          if (moment(a.created_at).diff(moment(b.created_at)) > 0)
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        // @ts-ignore
        const valueA = a[orderColumn] ? a[orderColumn].toLowerCase() : "";
        // @ts-ignore
        const valueAWithoutAccent = valueA
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        // @ts-ignore
        const valueB = b[orderColumn] ? b[orderColumn].toLowerCase() : "";
        const valueBWithoutAccent = valueB
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (valueAWithoutAccent > valueBWithoutAccent)
          return sortedHeader.sens === "up" ? 1 : -1;

        return sortedHeader.sens === "up" ? -1 : 1;
      }
    );
    return {
      usersToDisplay,
      usersForCount: usersFilteredBySearch,
    };
  };

  const getNbUsersByStatus = (users: SimplifiedUser[], status: string) => {
    if (status === "Admin") {
      return users.filter((user) => user.roles.includes("Admin")).length;
    }
    if (status === "Respo") {
      return users.filter((user) => user.roles.includes("Responsable")).length;
    }
    if (status === "Experts") {
      return users.filter((user) => user.roles.includes("ExpertTrad")).length;
    }
    if (status === "Traducteurs") {
      return users.filter((user) => user.langues && user.langues.length > 0)
        .length;
    }
    if (status === "Rédacteurs") {
      return users.filter((user) => user.roles.includes("Rédacteur")).length;
    }
    if (status === "Multi-structure") {
      return users.filter((user) => user.nbStructures > 1).length;
    }
    return users.length;
  };
  const { usersToDisplay, usersForCount } = filterAndSortUsers(users);
  if (isLoading || users.length === 0) {
    return <LoadingAdminUsers />;
  }
  return (
    <div className="admin-users">
      <SearchBarContainer>
        <CustomSearchBar
          value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher un utilisateur..."
        />
      </SearchBarContainer>
      <StyledHeader>
        <StyledTitle>Utilisateurs</StyledTitle>
        <FigureContainer>{users.length}</FigureContainer>

        <StyledSort marginTop="16px">
          {correspondingStatus.sort(compare).map((element) => {
            const status = element.status;
            const nbUsers = getNbUsersByStatus(usersForCount, status);
            return (
              <FilterButton
                key={status}
                onClick={() => onFilterClick(status)}
                text={`${status} (${nbUsers})`}
                isSelected={filter === status}
              />
            );
          })}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {userHeaders.map((element, key) => (
                <th
                  key={key}
                  onClick={() => {
                    reorder(element);
                  }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    isSortedHeader={sortedHeader.name === element.name}
                    sens={
                      sortedHeader.name === element.name
                        ? sortedHeader.sens
                        : "down"
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersToDisplay.map((element, key) => {
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
                    <div style={{ maxWidth: "300px", overflow: "hidden" }}>
                      <RowContainer>
                        <img className="user-img mr-8" src={secureUrl} />
                        <StructureName>{element.username}</StructureName>
                      </RowContainer>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>
                      {element.email}
                    </div>
                  </td>

                  <td className={"align-middle "}>
                    {element.structure && element.structure.nom}
                  </td>
                  <td className="align-middle">
                    <RoleContainer>
                      {element.roles.map((role) => (
                        <Role key={role} role={role} />
                      ))}
                    </RoleContainer>
                  </td>
                  <td className="align-middle">
                    <LangueContainer>
                      {element.langues.map((langue) => (
                        <LangueFlag langue={langue} key={langue} />
                      ))}
                    </LangueContainer>
                  </td>

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
