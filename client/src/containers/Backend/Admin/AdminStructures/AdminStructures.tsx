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
import {
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  StyledSort,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import "./AdminStructures.scss";
import {
  TabHeader,
  StyledStatus,
  FilterButton,
} from "../sharedComponents/SubComponents";
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
import { SelectFirstResponsableModal } from "./SelectFirstResponsableModal/SelectFirstResponsableModal";
import { NewStructureModal } from "./NewStructureModal/NewStructureModal";

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
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);

  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [
    selectedStructure,
    setSelectedStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleShowNewStructureModal = () =>
    setShowNewStructureModal(!showNewStructureModal);

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const addNewStructure = () => {
    toggleShowNewStructureModal();
  };

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

  if (
    (isLoading || structures.length === 0) &&
    showStructureDetailsModal === false
  ) {
    return (
      <div>
        <LoadingAdminStructures />
      </div>
    );
  }
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
              .includes(search.toLowerCase())
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
          const nbFichesA = a.nbFiches;
          const nbFichesB = b.nbFiches;

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
        <FButton
          type="dark"
          name="plus-circle-outline"
          onClick={addNewStructure}
        >
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
                  <ResponsableComponent
                    responsable={element.responsable}
                    canModifyRespo={false}
                    onClick={() => {}}
                  />
                </td>
                <td className="align-middle">{element.nbFiches}</td>
                <td className="align-middle">
                  {element.created_at
                    ? moment(element.created_at).format("LLL")
                    : "Non connue"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>

      <StructureDetailsModal
        show={showStructureDetailsModal}
        toggleModal={() => setSelectedStructureAndToggleModal(null)}
        selectedStructureId={selectedStructure ? selectedStructure._id : null}
        fetchStructures={() => dispatch(fetchAllStructuresActionsCreator())}
        toggleRespoModal={() => setSelectFirstRespoModal(true)}
      />
      <NewStructureModal
        show={showNewStructureModal}
        toggleModal={toggleShowNewStructureModal}
        fetchStructures={() => dispatch(fetchAllStructuresActionsCreator())}
      />

      <SelectFirstResponsableModal
        show={showSelectFirstRespoModal}
        toggleModal={() => setSelectFirstRespoModal(false)}
        selectedStructureId={selectedStructure ? selectedStructure._id : null}
      />
    </div>
  );
};
