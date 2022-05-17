import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/router";
import useRouterLocale from "hooks/useRouterLocale";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { LoadingAdminStructures } from "./components/LoadingAdminStructures";
import { prepareDeleteContrib } from "../Needs/lib";
import { NeedsChoiceModal } from "../AdminContenu/NeedsChoiceModal/NeedsChoiceModal";
import { ChangeStructureModal } from "../AdminContenu/ChangeStructureModale/ChangeStructureModale";

import { ImprovementsMailModal } from "../AdminContenu/ImprovementsMailModal/ImprovementsMailModal";
import { setAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import {
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  StyledSort,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import {
  TabHeader,
  StyledStatus,
  FilterButton,
} from "../sharedComponents/SubComponents";
import moment from "moment";
import "moment/locale/fr";
import { headers, correspondingStatus } from "./data";
import {
  RowContainer,
  StructureName,
  ResponsableComponent,
} from "./components/AdminStructureComponents";
import {
  SimplifiedStructureForAdmin,
  Responsable,
  StructureStatusType,
} from "types/interface";
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "components/UI/FButton/FButton";
import { StructureDetailsModal } from "./StructureDetailsModal/StructureDetailsModal";
import { SelectFirstResponsableModal } from "./SelectFirstResponsableModal/SelectFirstResponsableModal";
import { NewStructureModal } from "./NewStructureModal/NewStructureModal";
import { ObjectId } from "mongodb";
import { UserDetailsModal } from "../AdminUsers/UserDetailsModal/UserDetailsModal";
import { ContentDetailsModal } from "../AdminContenu/ContentDetailsModal/ContentDetailsModal";
import styles from "./AdminStructures.module.scss";
import { statusCompare } from "lib/statusCompare";
import { getAdminUrlParams, getInitialFilters } from "lib/getAdminUrlParams";
import { removeAccents } from "lib";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";

moment.locale("fr");

export const AdminStructures = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };

  // filters
  const router = useRouter();
  const locale = useRouterLocale();
  const initialFilters = getInitialFilters(router, "structures");
  const [filter, setFilter] = useState<StructureStatusType>(initialFilters.filter as StructureStatusType || "En attente");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");

  // modals
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(!!initialFilters.selectedUserId);
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(!!initialFilters.selectedStructureId);
  const [showContentDetailsModal, setShowContentDetailsModal] = useState(!!initialFilters.selectedDispositifId);
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);
  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [showImprovementsMailModal, setShowImprovementsMailModal] = useState(false);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<ObjectId | null>(initialFilters.selectedUserId);
  const [selectedStructureId, setSelectedStructureId] = useState<ObjectId | null>(initialFilters.selectedStructureId);
  const [selectedContentId, setSelectedContentId] = useState<ObjectId | null>(initialFilters.selectedDispositifId);
  const [selectedContentStatus, setSelectedContentStatus] = useState<string | null>(null);
  const [showNeedsChoiceModal, setShowNeedsChoiceModal] = useState(false);

  const dispatch = useDispatch();

  // update route params
  useEffect(() => {
    if (router.query.tab === "structures") {
      const params = getAdminUrlParams(
        router.query.tab,
        filter,
        selectedUserId,
        selectedContentId,
        selectedStructureId
      )

      router.replace({
        pathname: locale + "/backend/admin",
        search: params,
      }, undefined, { shallow: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter,
    router.query.tab,
    selectedUserId,
    selectedContentId,
    selectedStructureId
  ]);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleImprovementsMailModal = () =>
    setShowImprovementsMailModal(!showImprovementsMailModal);

  const toggleShowNewStructureModal = () =>
    setShowNewStructureModal(!showNewStructureModal);

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const toggleNeedsChoiceModal = () =>
    setShowNeedsChoiceModal(!showNeedsChoiceModal);

  const toggleShowChangeStructureModal = () =>
    setShowChangeStructureModal(!showChangeStructureModal);

  const addNewStructure = () => {
    toggleShowNewStructureModal();
  };

  const setSelectedStructureIdAndToggleModal = (
    element: SimplifiedStructureForAdmin | null
  ) => {
    setSelectedStructureId(element ? element._id : null);
    toggleStructureDetailsModal();
  };

  const onFilterClick = (status: StructureStatusType) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const structures = useSelector(allStructuresSelector);
  const dispositifs = useSelector(allDispositifsSelector);

  if (
    (isLoading || structures.length === 0) &&
    showStructureDetailsModal === false
  ) {
    return <LoadingAdminStructures />;
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

  const toggleUserDetailsModal = () =>
    setShowUserDetailsModal(!showUserDetailsModal);

  const toggleContentDetailsModal = () =>
    setShowContentDetailsModal(!showContentDetailsModal);

  const setSelectedUserIdAndToggleModal = (element: Responsable | null) => {
    setSelectedUserId(element ? element._id : null);
    toggleUserDetailsModal();
  };
  const setSelectedContentIdAndToggleModal = (
    element: ObjectId | null,
    status: string | null = null
  ) => {
    setSelectedContentId(element ? element : null);
    if (status) setSelectedContentStatus(status);
    toggleContentDetailsModal();
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
              .includes(removeAccents(search.toLowerCase()))
        )
      : structures;

    const filteredStructures = structuresFilteredBySearch.filter(
      (structure) => structure.status === filter
    ).sort((a, b) => moment(b.created_at).isBefore(moment(a.created_at)) ? -1 : 1);
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
    <div className={styles.container}>
      <SearchBarContainer>
        <CustomSearchBar
          value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher une structure..."
          withMargin={true}
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
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledTitle>Structures</StyledTitle>
          <FigureContainer>{nbNonDeletedStructures}</FigureContainer>
        </div>
        <StyledSort marginTop="8px">
          {correspondingStatus.sort(statusCompare).map((element) => {
            const status = element.storedStatus;
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
              <tr key={key}>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <RowContainer>
                    {element.picture && element.picture.secure_url && (
                      <Image
                        className={styles.sponsor_img + " mr-8"}
                        src={(element.picture || {}).secure_url}
                        alt=""
                        width={90}
                        height={35}
                        objectFit="contain"
                      />
                    )}
                    <StructureName>{element.nom}</StructureName>
                  </RowContainer>
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <StyledStatus
                    text={element.status}
                    textToDisplay={element.status}
                  />
                </td>
                <td
                  className="align-middle cursor-pointer"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbMembres}
                </td>

                <td
                  className={"align-middle "}
                  onClick={() =>
                    setSelectedUserIdAndToggleModal(element.responsable)
                  }
                >
                  <ResponsableComponent
                    responsable={element.responsable}
                    canClickOnRespo={false}
                  />
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbFiches}
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
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
        toggleModal={() => setSelectedStructureIdAndToggleModal(null)}
        selectedStructureId={selectedStructureId}
        toggleRespoModal={() => setSelectFirstRespoModal(true)}
        setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
        setSelectedContentIdAndToggleModal={setSelectedContentIdAndToggleModal}
      />
      <NewStructureModal
        show={showNewStructureModal}
        toggleModal={toggleShowNewStructureModal}
      />

      <SelectFirstResponsableModal
        show={showSelectFirstRespoModal}
        toggleModal={() => setSelectFirstRespoModal(false)}
        selectedStructureId={selectedStructureId}
      />
      {selectedUserId && (
        <UserDetailsModal
          show={showUserDetailsModal}
          toggleModal={() => setSelectedUserIdAndToggleModal(null)}
          selectedUserId={selectedUserId}
          setSelectedStructureIdAndToggleModal={
            setSelectedStructureIdAndToggleModal
          }
        />
      )}

      {selectedContentId && (
        <ContentDetailsModal
          show={showContentDetailsModal}
          setSelectedStructureIdAndToggleModal={
            setSelectedStructureIdAndToggleModal
          }
          toggleModal={() => setSelectedContentIdAndToggleModal(null)}
          selectedDispositifId={selectedContentId}
          setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
          onDeleteClick={() =>
            prepareDeleteContrib(
              dispositifs,
              setAllDispositifsActionsCreator,
              dispatch,
              selectedContentId
            )
          }
          toggleNeedsChoiceModal={toggleNeedsChoiceModal}
          toggleImprovementsMailModal={toggleImprovementsMailModal}
          setShowChangeStructureModal={setShowChangeStructureModal}
        />
      )}
      {showImprovementsMailModal && (
        <ImprovementsMailModal
          show={showImprovementsMailModal}
          toggleModal={toggleImprovementsMailModal}
          selectedDispositifId={selectedContentId}
        />
      )}
      {showNeedsChoiceModal && (
        <NeedsChoiceModal
          show={showNeedsChoiceModal}
          toggle={toggleNeedsChoiceModal}
          dispositifId={selectedContentId}
        />
      )}
      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedContentId}
        dispositifStatus={selectedContentStatus}
      />
    </div>
  );
};
