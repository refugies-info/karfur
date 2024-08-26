import WriteContentModal from "components/Modals/WriteContentModal/WriteContentModal";
import CustomSearchBar from "components/UI/CustomSeachBar";
import FButton from "components/UI/FButton/FButton";
import useRouterLocale from "hooks/useRouterLocale";
import moment from "moment";
import "moment/locale/fr";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Table } from "reactstrap";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import {
  fetchAllDispositifsActionsCreator,
  setAllDispositifsActionsCreator,
} from "services/AllDispositifs/allDispositifs.actions";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import Swal from "sweetalert2";
import API from "utils/API";
import { colors } from "utils/colors";
import { SelectFirstResponsableModal } from "../AdminStructures/SelectFirstResponsableModal/SelectFirstResponsableModal";
import { StructureDetailsModal } from "../AdminStructures/StructureDetailsModal/StructureDetailsModal";
import { UserDetailsModal } from "../AdminUsers/UserDetailsModal/UserDetailsModal";
import { prepareDeleteContrib } from "../Needs/lib";
import {
  Content,
  FigureContainer,
  StyledHeader,
  StyledHeaderInner,
  StyledSort,
  StyledTitle,
} from "../sharedComponents/StyledAdmin";
import {
  ColoredRound,
  DeleteButton,
  FilterButton,
  SeeButton,
  Structure,
  StyledStatus,
  TabHeader,
  Title,
  TypeContenu,
  ValidateButton,
} from "../sharedComponents/SubComponents";
import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";
import { LoadingAdminContenu } from "./components/LoadingAdminContenu";
import { ContentDetailsModal } from "./ContentDetailsModal/ContentDetailsModal";
import { correspondingStatus, table_contenu } from "./data";
import { ImprovementsMailModal } from "./ImprovementsMailModal/ImprovementsMailModal";

import { DispositifStatus, GetAllDispositifsResponse, Id } from "@refugies-info/api-types";
import { removeAccents } from "lib";
import { getAdminUrlParams, getInitialFilters } from "lib/getAdminUrlParams";
import { handleApiError } from "lib/handleApiErrors";
import { statusCompare } from "lib/statusCompare";
import { needsSelector } from "services/Needs/needs.selectors";
import styles from "./AdminContenu.module.scss";
import { NeedsChoiceModal } from "./NeedsChoiceModal/NeedsChoiceModal";

moment.locale("fr");

const normalize = (value: string) => {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const AdminContenu = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };
  const dispositifs = useSelector(allDispositifsSelector);

  // filters
  const router = useRouter();
  const locale = useRouterLocale();
  const initialFilters = getInitialFilters(router, "contenus");
  const [filter, setFilter] = useState<DispositifStatus>(
    (initialFilters.filter as DispositifStatus) || DispositifStatus.WAITING_ADMIN,
  );
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");

  // modals
  const [showDetailsModal, setShowDetailsModal] = useState(!!initialFilters.selectedDispositifId);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(!!initialFilters.selectedUserId);
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(!!initialFilters.selectedStructureId);
  const [showImprovementsMailModal, setShowImprovementsMailModal] = useState(false);
  const [showNeedsChoiceModal, setShowNeedsChoiceModal] = useState(false);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(false);
  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);

  const [selectedContentId, setSelectedContentId] = useState<Id | null>(initialFilters.selectedDispositifId);
  const [selectedUserId, setSelectedUserId] = useState<Id | null>(initialFilters.selectedUserId);
  const [selectedStructureId, setSelectedStructureId] = useState<Id | null>(initialFilters.selectedStructureId);

  const [isExportLoading, setIsExportLoading] = useState(false);

  const headers = table_contenu.headers;
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));

  const toggleShowChangeStructureModal = () => setShowChangeStructureModal(!showChangeStructureModal);

  const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  const toggleNeedsChoiceModal = () => setShowNeedsChoiceModal(!showNeedsChoiceModal);

  const toggleImprovementsMailModal = () => setShowImprovementsMailModal(!showImprovementsMailModal);

  const toggleUserDetailsModal = () => setShowUserDetailsModal(!showUserDetailsModal);

  const setSelectedUserIdAndToggleModal = (userId: Id | null) => {
    setSelectedUserId(userId);
    toggleUserDetailsModal();
  };

  const setSelectedDispositifAndToggleModal = (id: Id | null) => {
    setSelectedContentId(id);
    toggleDetailsModal();
  };
  const allNeeds = useSelector(needsSelector);
  const dispatch = useDispatch();

  // update route params
  useEffect(() => {
    if (router.query.tab === "contenus") {
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

  if (isLoading || dispositifs.length === 0) {
    return (
      <div className="admin-contenu animated fadeIn">
        <LoadingAdminContenu />
      </div>
    );
  }

  const getNbDispositifsByStatus = (dispositifsToDisplay: GetAllDispositifsResponse[], status: string) =>
    dispositifsToDisplay && dispositifsToDisplay.length > 0
      ? dispositifsToDisplay.filter((dispo) => dispo.status === status).length
      : 0;

  const filterAndSortDispositifs = (dispositifs: GetAllDispositifsResponse[]) => {
    const dispositifsFilteredBySearch = !!search
      ? dispositifs.filter(
          (dispo) =>
            (dispo.titreInformatif &&
              dispo.titreInformatif
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(removeAccents(search.toLowerCase()))) ||
            (dispo.titreMarque &&
              dispo.titreMarque
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(removeAccents(search.toLowerCase()))) ||
            (dispo.mainSponsor?.nom &&
              dispo.mainSponsor.nom
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(removeAccents(search.toLowerCase()))),
        )
      : dispositifs;

    const filteredDispositifs = dispositifsFilteredBySearch.filter((dispo) => dispo.status === filter);
    if (sortedHeader.name === "none")
      return {
        dispositifsToDisplay: filteredDispositifs,
        dispositifsForCount: dispositifsFilteredBySearch,
      };

    const dispositifsToDisplay = filteredDispositifs.sort((a, b) => {
      if (sortedHeader.orderColumn === "needs") {
        const nbNeedsA = a.needs ? a.needs.length : 0;
        const nbNeedsB = b.needs ? b.needs.length : 0;

        if (nbNeedsA > nbNeedsB) return sortedHeader.sens === "up" ? 1 : -1;

        return sortedHeader.sens === "up" ? -1 : 1;
      }

      let valueA, valueB;
      if (sortedHeader.orderColumn === "mainSponsor") {
        valueA = normalize((a?.mainSponsor?.nom || "").toLowerCase());
        valueB = normalize((b?.mainSponsor?.nom || "").toLowerCase());
      } else if (sortedHeader.orderColumn === "nbMercis" || sortedHeader.orderColumn === "nbVues") {
        valueA = a[sortedHeader.orderColumn];
        valueB = b[sortedHeader.orderColumn];
      } else {
        //@ts-ignore
        valueA = normalize((a[sortedHeader.orderColumn] || "").toLowerCase());
        //@ts-ignore
        valueB = normalize((b[sortedHeader.orderColumn] || "").toLowerCase());
      }

      if (valueA > valueB) return sortedHeader.sens === "up" ? 1 : -1;

      return sortedHeader.sens === "up" ? -1 : 1;
    });
    return {
      dispositifsToDisplay,
      dispositifsForCount: dispositifsFilteredBySearch,
    };
  };

  const { dispositifsToDisplay, dispositifsForCount } = filterAndSortDispositifs(dispositifs);

  const reorder = (element: { name: string; order: string | null }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, orderColumn: element.order || "" });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        orderColumn: element.order || "",
      });
    }
  };

  const exportToAirtable = async () => {
    try {
      setIsExportLoading(true);
      await API.exportDispositifs();
      setIsExportLoading(false);

      Swal.fire({
        title: "Yay...",
        text: "Export en cours",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      handleApiError({ text: "Something went wrong" });
    }
  };

  const onFilterClick = (status: DispositifStatus) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const toggleStructureDetailsModal = () => setShowStructureDetailsModal(!showStructureDetailsModal);

  const setSelectedContentIdAndToggleModal = (element: Id | null, _status: string | null = null) => {
    setSelectedDispositifAndToggleModal(element || null);
  };

  const setSelectedStructureIdAndToggleModal = (structureId: Id | null) => {
    setSelectedStructureId(structureId);
    toggleStructureDetailsModal();
  };
  const handleChange = (e: any) => setSearch(e.target.value);

  const publishDispositif = async (dispositif: GetAllDispositifsResponse, disabled: boolean) => {
    if (disabled) return;
    let question: any = { value: true };
    const link = `/${dispositif.typeContenu}/${dispositif._id}`;

    const text =
      dispositif.status === "En attente" || dispositif.status === DispositifStatus.OK_STRUCTURE
        ? "Cette fiche n'a pas encore été validée par sa structure d'appartenance"
        : "Cette fiche sera visible par tous.";

    question = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text,

      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le valider",
      cancelButtonText: "Annuler",
    });

    if (question.value) {
      try {
        await API.updateDispositifStatus(dispositif._id, { status: DispositifStatus.ACTIVE });

        Swal.fire({
          title: "Yay...",
          text: "Contenu publié",
          icon: "success",
          timer: 5500,
          footer: `<a target='_blank' href=${link}>Voir le contenu</a>`,
        });
        dispatch(fetchAllDispositifsActionsCreator());
        dispatch(fetchActiveDispositifsActionsCreator());
      } catch (error) {
        handleApiError({ text: "Something went wrong" });
      }
    }
  };

  const checkIfNeedsAreCompatibleWithTags = (element: GetAllDispositifsResponse) => {
    if (allNeeds.length === 0) {
      return false;
    }
    if (!element.needs || element.needs.length === 0 || !element.theme) return false;

    const formattedNeedsTheme = element.needs.map((needId) => {
      const needArray = allNeeds.filter((need) => need._id === needId);
      const needTheme = needArray.length > 0 ? needArray[0].theme._id : null;
      return needTheme;
    });

    const uniqueNeedsTheme = [...new Set(formattedNeedsTheme)];
    const uniqueThemes = [...new Set([element.theme, ...(element.secondaryThemes || [])])];

    return uniqueNeedsTheme.sort().join(",") === uniqueThemes.sort().join(",");
  };
  const nbNonDeletedDispositifs =
    dispositifs.length > 0 ? dispositifs.filter((dispo) => dispo.status !== "Supprimé").length : 0;

  return (
    <div>
      <StyledHeader>
        <StyledHeaderInner>
          <StyledTitle>Contenus</StyledTitle>
          <FigureContainer>{nbNonDeletedDispositifs}</FigureContainer>
        </StyledHeaderInner>
        <StyledSort>
          {process.env.NEXT_PUBLIC_REACT_APP_ENV === "production" && (
            <FButton type="dark" className="me-2" onClick={exportToAirtable}>
              {isExportLoading ? <Spinner /> : "Exporter dans Airtable"}
            </FButton>
          )}
          <CustomSearchBar
            value={search}
            onChange={handleChange}
            placeholder="Rechercher un contenu..."
            withMargin={true}
          />
          <FButton
            onClick={() => setShowWriteModal(true)}
            type="dark"
            name="plus-circle-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ajouter un contenu
          </FButton>
        </StyledSort>
      </StyledHeader>
      <StyledHeader>
        <StyledSort>
          {correspondingStatus.sort(statusCompare).map((status) => {
            const nbContent = getNbDispositifsByStatus(dispositifsForCount, status.storedStatus);
            return (
              <FilterButton
                key={status.storedStatus}
                onClick={() => onFilterClick(status.storedStatus)}
                text={`${status.adminStatus || status.displayedStatus} (${nbContent})`}
                isSelected={filter === status.storedStatus}
              />
            );
          })}
        </StyledSort>
      </StyledHeader>

      <Content>
        <Table borderless>
          <thead>
            <tr>
              {headers.map((element: { name: string; order: string | null }, key) => (
                <th key={key} onClick={() => reorder(element)}>
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
            {dispositifsToDisplay.map((element, key) => {
              const date =
                element.status === DispositifStatus.DELETED && element.deletionDate
                  ? element.deletionDate
                  : element.lastModificationDate;
              const nbDays = date ? -moment(date).diff(moment(), "days") + " jours" : "ND";
              const burl = "/" + (element.typeContenu || "dispositif") + "/" + element._id;
              const validationDisabled =
                element.status === "Actif" || !element.mainSponsor || element.mainSponsor.status !== "Actif";

              const areNeedsCompatibleWithTags = checkIfNeedsAreCompatibleWithTags(element);

              return (
                <tr key={key}>
                  <td className="align-middle" onClick={() => setSelectedDispositifAndToggleModal(element._id)}>
                    <TypeContenu type={element.typeContenu || "dispositif"} isDetailedVue={false} />
                  </td>
                  <td className="align-middle">
                    <div className={styles.row}>
                      <ColoredRound color={areNeedsCompatibleWithTags ? colors.validationHover : colors.error} />
                      {element.needs ? element.needs.length : 0}
                    </div>
                  </td>
                  <td className="align-middle" onClick={() => setSelectedDispositifAndToggleModal(element._id)}>
                    <Title titreInformatif={element.titreInformatif} titreMarque={element.titreMarque || null} />
                  </td>
                  <td
                    className="align-middle cursor-pointer"
                    onClick={() => setSelectedStructureIdAndToggleModal(element.mainSponsor?._id || null)}
                  >
                    <Structure sponsor={element.mainSponsor} />
                  </td>
                  <td className={"align-middle "} onClick={() => setSelectedDispositifAndToggleModal(element._id)}>
                    {nbDays}
                  </td>
                  <td className="align-middle" onClick={() => setSelectedDispositifAndToggleModal(element._id)}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {element.adminProgressionStatus && (
                        <div style={{ marginRight: "8px" }}>
                          <StyledStatus text={element.adminProgressionStatus} />
                        </div>
                      )}
                      {element.adminPercentageProgressionStatus && (
                        <StyledStatus text={element.adminPercentageProgressionStatus} />
                      )}
                    </div>
                  </td>
                  <td className="align-middle" onClick={() => setSelectedDispositifAndToggleModal(element._id)}>
                    <StyledStatus
                      text={element.status}
                      textToDisplay={element.hasDraftVersion ? "Nouvelle version en cours" : undefined}
                    />
                  </td>
                  <td className="align-middle fw-bold">{element.nbMercis} 🙏</td>
                  <td className="align-middle fw-bold">{element.nbVues || 0} 📈</td>
                  <td className="align-middle">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <SeeButton burl={burl} />
                      <ValidateButton
                        onClick={() => publishDispositif(element, validationDisabled)}
                        disabled={validationDisabled}
                      />
                      <DeleteButton
                        onClick={() =>
                          prepareDeleteContrib(dispositifs, setAllDispositifsActionsCreator, dispatch, element._id)
                        }
                        disabled={element.status === "Supprimé"}
                        testId={`delete-button-${element._id}`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
      <ContentDetailsModal
        show={showDetailsModal}
        toggleModal={() => setSelectedDispositifAndToggleModal(null)}
        toggleRespoModal={(structureId: Id) => {
          setSelectedStructureId(structureId);
          setSelectFirstRespoModal(true);
        }}
        setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
        selectedDispositifId={selectedContentId}
        onDeleteClick={() =>
          prepareDeleteContrib(dispositifs, setAllDispositifsActionsCreator, dispatch, selectedContentId)
        }
        setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
        setShowChangeStructureModal={setShowChangeStructureModal}
        toggleImprovementsMailModal={toggleImprovementsMailModal}
        toggleNeedsChoiceModal={toggleNeedsChoiceModal}
      />
      {showImprovementsMailModal && (
        <ImprovementsMailModal
          show={showImprovementsMailModal}
          toggleModal={toggleImprovementsMailModal}
          selectedDispositifId={selectedContentId}
        />
      )}
      <UserDetailsModal
        show={showUserDetailsModal}
        toggleModal={() => setSelectedUserIdAndToggleModal(null)}
        selectedUserId={selectedUserId}
        setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
      />

      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedContentId}
      />

      {selectedStructureId && (
        <StructureDetailsModal
          show={showStructureDetailsModal}
          toggleModal={() => setSelectedStructureIdAndToggleModal(null)}
          selectedStructureId={selectedStructureId}
          toggleRespoModal={() => setSelectFirstRespoModal(true)}
          setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
          setSelectedContentIdAndToggleModal={setSelectedContentIdAndToggleModal}
        />
      )}
      {selectedStructureId && (
        <SelectFirstResponsableModal
          show={showSelectFirstRespoModal}
          toggleModal={() => setSelectFirstRespoModal(false)}
          selectedStructureId={selectedStructureId}
        />
      )}
      {showNeedsChoiceModal && (
        <NeedsChoiceModal
          show={showNeedsChoiceModal}
          toggleModal={toggleNeedsChoiceModal}
          dispositifId={selectedContentId}
        />
      )}
      <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
    </div>
  );
};
