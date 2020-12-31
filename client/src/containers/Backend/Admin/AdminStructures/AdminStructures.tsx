/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllStructuresActionsCreator,
  setAllStructuresActionCreator,
} from "../../../../services/AllStructures/allStructures.actions";
import { allStructuresSelector } from "../../../../services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { LoadingAdminStructures } from "./components/LoadingAdminStructures";
// import Swal from "sweetalert2";
// import {
//   fetchAllDispositifsActionsCreator,
//   setAllDispositifsActionsCreator,
// } from "../../../services/AllDispositifs/allDispositifs.actions";
// import { fetchActiveDispositifsActionsCreator } from "../../../services/ActiveDispositifs/activeDispositifs.actions";
// import API from "../../../utils/API";
import {
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  StyledSort,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import "./AdminStructures.scss";
// import {colors} from "colors";
// import { allDispositifsSelector } from "../../../services/AllDispositifs/allDispositifs.selector";
// import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
// import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
// import { LoadingAdminContenu } from "./components/LoadingAdminContenu";
import {
  //   TypeContenu,
  //   Title,
  //   Structure,
  //   StyledStatus,
  //   ValidateButton,
  //   SeeButton,
  //   DeleteButton,
  //   FilterButton,
  TabHeader,
  StyledStatus,
  FilterButton,
} from "../sharedComponents/SubComponents";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import { headers, correspondingStatus } from "./data";
import {
  RowContainer,
  StructureName,
  ResponsableComponent,
} from "./components/AdminStructureComponents";
import { SimplifiedStructureForAdmin } from "../../../../types/interface";
import { compare } from "../AdminContenu/AdminContenu";
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "components/FigmaUI/FButton/FButton";
import { StructureDetailsModal } from "./StructureDetailsModal/StructureDetailsModal";

// import { CustomSearchBar } from "../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
// import FButton from "../../../components/FigmaUI/FButton/FButton";
// import { DetailsModal } from "./DetailsModal/DetailsModal";
// import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";

moment.locale("fr");
declare const window: Window;

export const AdminStructures = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };

  const [filter, setFilter] = useState("En attente");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(
    false
  );
  const [
    selectedStructure,
    setSelectedStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const setSelectedStructureAndToggleModal = (
    element: SimplifiedStructureForAdmin | null
  ) => {
    setSelectedStructure(element);
    toggleStructureDetailsModal();
  };

  const onFilterClick = (status: string) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const loadStructures = async () => {
      await dispatch(fetchAllStructuresActionsCreator());
    };
    loadStructures();

    window.scrollTo(0, 0);

    return () => {
      dispatch(setAllStructuresActionCreator([]));
    };
  }, [dispatch]);

  const structures = useSelector(allStructuresSelector);

  if (isLoading || structures.length === 0) {
    return (
      <div>
        <LoadingAdminStructures />
      </div>
    );
  }
  const reorder = (element: any) => {
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

  const filterAndSortStructures = (
    structures: SimplifiedStructureForAdmin[]
  ) => {
    const structuresFilteredBySearch = !!search
      ? structures.filter(
          (structure) =>
            structure.nom &&
            structure.nom
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(search)
        )
      : structures;

    const filteredStructures = structuresFilteredBySearch.filter(
      (structure) => structure.status === filter
    );
    if (sortedHeader.name === "none")
      return {
        structuresToDisplay: filteredStructures,
        structuresForCount: structuresFilteredBySearch,
      };

    const structuresToDisplay = filteredStructures.sort(
      (a: SimplifiedStructureForAdmin, b: SimplifiedStructureForAdmin) => {
        // @ts-ignore
        const orderColumn:
          | "nom"
          | "status"
          | "nbMembres"
          | "responsable"
          | "nbFiches"
          | "created_at" = sortedHeader.orderColumn;

        if (orderColumn === "nbMembres") {
          if (a[orderColumn] > b[orderColumn])
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "nbFiches") {
          const nbFichesA = a.dispositifsAssocies.length;
          const nbFichesB = b.dispositifsAssocies.length;

          if (nbFichesA > nbFichesB) return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "responsable") {
          const respoA =
            a.responsable && a.responsable.username
              ? a.responsable.username.toLowerCase()
              : "";
          const respoB =
            b.responsable && b.responsable.username
              ? b.responsable.username.toLowerCase()
              : "";

          if (respoA > respoB) return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        if (orderColumn === "created_at") {
          if (moment(a.created_at).diff(moment(b.created_at)) > 0)
            return sortedHeader.sens === "up" ? 1 : -1;
          return sortedHeader.sens === "up" ? -1 : 1;
        }

        const valueA = a[orderColumn] ? a[orderColumn].toLowerCase() : "";
        const valueAWithoutAccent = valueA
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
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
      structuresToDisplay,
      structuresForCount: structuresFilteredBySearch,
    };
  };

  const getNbStructuresByStatus = (
    structures: SimplifiedStructureForAdmin[],
    status: string
  ) =>
    structures && structures.length > 0
      ? structures.filter((structure) => structure.status === status).length
      : 0;

  const { structuresToDisplay, structuresForCount } = filterAndSortStructures(
    structures
  );

  const nbNonDeletedStructures = structures.filter(
    (structure) => structure.status !== "Supprimé"
  ).length;
  return (
    <div className="admin-structures">
      <SearchBarContainer>
        <CustomSearchBar
          value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher une structure..."
        />
        <FButton type="dark" name="plus-circle-outline">
          Ajouter une structure
        </FButton>
      </SearchBarContainer>
      <StyledHeader>
        <StyledTitle>Structures</StyledTitle>
        <FigureContainer>{nbNonDeletedStructures}</FigureContainer>

        <StyledSort marginTop="16px">
          {correspondingStatus.sort(compare).map((element) => {
            const status = element.status;
            const nbStructures = getNbStructuresByStatus(
              structuresForCount,
              status
            );
            return (
              <FilterButton
                key={status}
                onClick={() => onFilterClick(status)}
                text={`${status} (${nbStructures})`}
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
              {headers.map((element, key) => (
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
            {structuresToDisplay.map((element, key) => (
              <tr
                key={key}
                onClick={() => setSelectedStructureAndToggleModal(element)}
              >
                <td className="align-middle">
                  <RowContainer>
                    {element.picture && element.picture.secure_url && (
                      <img
                        className="sponsor-img mr-8"
                        src={(element.picture || {}).secure_url}
                      />
                    )}
                    <StructureName>{element.nom}</StructureName>
                  </RowContainer>
                </td>
                <td className="align-middle">
                  <StyledStatus
                    text={element.status}
                    textToDisplay={element.status}
                  />
                </td>
                <td className="align-middle cursor-pointer">
                  {element.nbMembres}
                </td>
                <td className={"align-middle "}>
                  {/* <RowContainer>
                    {element.responsable && (
                      <img
                        className="respo-img mr-8"
                        src={responsableSecureUrl}
                      />
                    )}
                    {responsableName}
                  </RowContainer> */}

                  <ResponsableComponent responsable={element.responsable} />
                </td>
                <td className="align-middle">
                  {element.dispositifsAssocies.length}
                </td>
                <td className="align-middle">
                  {moment(element.created_at).format("lll")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
      <StructureDetailsModal
        show={showStructureDetailsModal}
        toggleModal={() => setSelectedStructureAndToggleModal(null)}
        selectedStructure={selectedStructure}
        fetchStructures={() => dispatch(fetchAllStructuresActionsCreator())}
      />
    </div>
  );
};
