import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import useRouterLocale from "~/hooks/useRouterLocale";
import { allStructuresSelector } from "~/services/AllStructures/allStructures.selector";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import { ChangeStructureModal } from "../AdminContenu/ChangeStructureModale/ChangeStructureModale";
import { NeedsChoiceModal } from "../AdminContenu/NeedsChoiceModal/NeedsChoiceModal";
import { prepareDeleteContrib } from "../Needs/lib";
import { LoadingAdminStructures } from "./components/LoadingAdminStructures";

import { GetAllStructuresResponse, Id, StructureStatus } from "@refugies-info/api-types";
import moment from "moment";
import "moment/locale/fr";
import CustomSearchBar from "~/components/UI/CustomSeachBar";
import FButton from "~/components/UI/FButton/FButton";
import { removeAccents } from "~/lib";
import { getAdminUrlParams, getInitialFilters } from "~/lib/getAdminUrlParams";
import { statusCompare } from "~/lib/statusCompare";
import { setAllDispositifsActionsCreator } from "~/services/AllDispositifs/allDispositifs.actions";
import { allDispositifsSelector } from "~/services/AllDispositifs/allDispositifs.selector";
import { ContentDetailsModal } from "../AdminContenu/ContentDetailsModal/ContentDetailsModal";
import { ImprovementsMailModal } from "../AdminContenu/ImprovementsMailModal/ImprovementsMailModal";
import { UserDetailsModal } from "../AdminUsers/UserDetailsModal/UserDetailsModal";
import {
  Content,
  FigureContainer,
  StyledHeader,
  StyledHeaderInner,
  StyledSort,
  StyledTitle,
} from "../sharedComponents/StyledAdmin";
import { FilterButton, StyledStatus, TabHeader } from "../sharedComponents/SubComponents";
import styles from "./AdminStructures.module.scss";
import { ResponsableComponent, RowContainer, StructureName } from "./components/AdminStructureComponents";
import { correspondingStatus, headers } from "./data";
import { NewStructureModal } from "./NewStructureModal/NewStructureModal";
import { SelectFirstResponsableModal } from "./SelectFirstResponsableModal/SelectFirstResponsableModal";
import { StructureDetailsModal } from "./StructureDetailsModal/StructureDetailsModal";

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
  const [filter, setFilter] = useState<StructureStatus>(
    (initialFilters.filter as StructureStatus) || StructureStatus.WAITING,
  );
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

  const [selectedUserId, setSelectedUserId] = useState<Id | null>(initialFilters.selectedUserId);
  const [selectedStructureId, setSelectedStructureId] = useState<Id | null>(initialFilters.selectedStructureId);
  const [selectedContentId, setSelectedContentId] = useState<Id | null>(initialFilters.selectedDispositifId);
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
        selectedStructureId,
      );

      router.replace(
        {
          pathname: locale + "/backend/admin",
          search: params,
        },
        undefined,
        { shallow: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, router.query.tab, selectedUserId, selectedContentId, selectedStructureId]);

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES));

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleImprovementsMailModal = () => setShowImprovementsMailModal(!showImprovementsMailModal);

  const toggleShowNewStructureModal = () => setShowNewStructureModal(!showNewStructureModal);

  const toggleStructureDetailsModal = () => setShowStructureDetailsModal(!showStructureDetailsModal);

  const toggleNeedsChoiceModal = () => setShowNeedsChoiceModal(!showNeedsChoiceModal);

  const toggleShowChangeStructureModal = () => setShowChangeStructureModal(!showChangeStructureModal);

  const addNewStructure = () => {
    toggleShowNewStructureModal();
  };

  const setSelectedStructureIdAndToggleModal = (structureId: Id | null) => {
    setSelectedStructureId(structureId);
    toggleStructureDetailsModal();
  };

  const onFilterClick = (status: StructureStatus) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const structures = useSelector(allStructuresSelector);
  const dispositifs = useSelector(allDispositifsSelector);

  if (isLoading || structures.length === 0) {
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

  const toggleUserDetailsModal = () => setShowUserDetailsModal(!showUserDetailsModal);

  const toggleContentDetailsModal = () => setShowContentDetailsModal(!showContentDetailsModal);

  const setSelectedUserIdAndToggleModal = (userId: Id | null) => {
    setSelectedUserId(userId);
    toggleUserDetailsModal();
  };
  const setSelectedContentIdAndToggleModal = (element: Id | null, status: string | null = null) => {
    setSelectedContentId(element ? element : null);
    if (status) setSelectedContentStatus(status);
    toggleContentDetailsModal();
  };

  const filterAndSortStructures = (structures: GetAllStructuresResponse[]) => {
    const structuresFilteredBySearch = !!search
      ? structures.filter(
          (structure) =>
            structure.nom &&
            structure.nom
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(removeAccents(search.toLowerCase())),
        )
      : structures;

    const filteredStructures = structuresFilteredBySearch
      .filter((structure) => structure.status === filter)
      .sort((a, b) => (moment(b.created_at).isBefore(moment(a.created_at)) ? -1 : 1));
    if (sortedHeader.name === "none")
      return {
        structuresToDisplay: filteredStructures,
        structuresForCount: structuresFilteredBySearch,
      };

    const structuresToDisplay = filteredStructures.sort((a: GetAllStructuresResponse, b: GetAllStructuresResponse) => {
      // @ts-ignore
      const orderColumn: "nom" | "status" | "nbMembres" | "responsable" | "nbFiches" | "created_at" =
        sortedHeader.orderColumn;

      if (orderColumn === "nbMembres") {
        if (a[orderColumn] > b[orderColumn]) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      if (orderColumn === "nbFiches") {
        const nbFichesA = a.nbFiches;
        const nbFichesB = b.nbFiches;

        if (nbFichesA > nbFichesB) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      if (orderColumn === "responsable") {
        const respoA = a.responsable && a.responsable.username ? a.responsable.username.toLowerCase() : "";
        const respoB = b.responsable && b.responsable.username ? b.responsable.username.toLowerCase() : "";

        if (respoA > respoB) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      if (orderColumn === "created_at") {
        if (moment(a.created_at).diff(moment(b.created_at)) > 0) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      const valueA = a[orderColumn]?.toLowerCase() || "";
      const valueAWithoutAccent = valueA.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const valueB = b[orderColumn]?.toLowerCase() || "";
      const valueBWithoutAccent = valueB.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (valueAWithoutAccent > valueBWithoutAccent) return sortedHeader.sens === "up" ? 1 : -1;

      return sortedHeader.sens === "up" ? -1 : 1;
    });
    return {
      structuresToDisplay,
      structuresForCount: structuresFilteredBySearch,
    };
  };

  const getNbStructuresByStatus = (structures: GetAllStructuresResponse[], status: string) =>
    structures && structures.length > 0 ? structures.filter((structure) => structure.status === status).length : 0;

  const { structuresToDisplay, structuresForCount } = filterAndSortStructures(structures);

  const nbNonDeletedStructures = structures.filter((structure) => structure.status !== "Supprimé").length;
  return (
    <div className={styles.container}>
      <StyledHeader>
        <StyledHeaderInner>
          <StyledTitle>Structures</StyledTitle>
          <FigureContainer>{nbNonDeletedStructures}</FigureContainer>
        </StyledHeaderInner>
        <StyledSort>
          <CustomSearchBar
            value={search}
            // @ts-ignore
            onChange={handleChange}
            placeholder="Rechercher une structure..."
            withMargin={true}
          />
          <FButton type="dark" name="plus-circle-outline" onClick={addNewStructure}>
            Ajouter une structure
          </FButton>
        </StyledSort>
      </StyledHeader>
      <StyledHeader>
        <StyledSort>
          {correspondingStatus.sort(statusCompare).map((element) => {
            const status = element.storedStatus;
            const nbStructures = getNbStructuresByStatus(structuresForCount, status);
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
                    sens={sortedHeader.name === element.name ? sortedHeader.sens : "down"}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {structuresToDisplay.map((element, key) => (
              <tr key={key}>
                <td className="align-middle" onClick={() => setSelectedStructureIdAndToggleModal(element._id)}>
                  <RowContainer>
                    {element.picture && element.picture.secure_url && (
                      <Image
                        className={styles.sponsor_img + " me-2"}
                        src={(element.picture || {}).secure_url || ""}
                        alt=""
                        width={90}
                        height={35}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <StructureName>{element.nom}</StructureName>
                  </RowContainer>
                </td>
                <td className="align-middle" onClick={() => setSelectedStructureIdAndToggleModal(element._id)}>
                  <StyledStatus text={element.status || ""} textToDisplay={element.status} />
                </td>
                <td
                  className="align-middle cursor-pointer"
                  onClick={() => setSelectedStructureIdAndToggleModal(element._id)}
                >
                  {element.nbMembres}
                </td>

                <td
                  className={"align-middle "}
                  onClick={() => setSelectedUserIdAndToggleModal(element.responsable?._id || null)}
                >
                  <ResponsableComponent responsable={element.responsable} canClickOnRespo={false} />
                </td>
                <td className="align-middle" onClick={() => setSelectedStructureIdAndToggleModal(element._id)}>
                  {element.nbFiches}
                </td>
                <td className="align-middle" onClick={() => setSelectedStructureIdAndToggleModal(element._id)}>
                  {element.created_at ? moment(element.created_at).format("LLL") : "Non connue"}
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
        defaultStatus={StructureStatus.WAITING}
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
          setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
        />
      )}

      {selectedContentId && (
        <ContentDetailsModal
          show={showContentDetailsModal}
          setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
          toggleModal={() => setSelectedContentIdAndToggleModal(null)}
          toggleRespoModal={(structureId: Id) => {
            setSelectedStructureId(structureId);
            setSelectFirstRespoModal(true);
          }}
          selectedDispositifId={selectedContentId}
          setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
          onDeleteClick={() =>
            prepareDeleteContrib(dispositifs, setAllDispositifsActionsCreator, dispatch, selectedContentId)
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
          toggleModal={toggleNeedsChoiceModal}
          dispositifId={selectedContentId}
        />
      )}
      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedContentId}
      />
    </div>
  );
};
