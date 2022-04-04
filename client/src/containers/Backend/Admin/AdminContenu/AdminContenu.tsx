import React, { useEffect, useState } from "react";
import { Table, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import useRouterLocale from "hooks/useRouterLocale";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { prepareDeleteContrib } from "../Needs/lib";
import { table_contenu, correspondingStatus, FilterContentStatus } from "./data";
import API from "utils/API";
import {
  StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import { colors } from "colors";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { LoadingAdminContenu } from "./components/LoadingAdminContenu";
import {
  TypeContenu,
  Title,
  Structure,
  StyledStatus,
  ValidateButton,
  SeeButton,
  DeleteButton,
  FilterButton,
  TabHeader,
  ColoredRound,
} from "../sharedComponents/SubComponents";
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "components/UI/FButton/FButton";
import { DetailsModal } from "./DetailsModal/DetailsModal";
import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";
import { StructureDetailsModal } from "../AdminStructures/StructureDetailsModal/StructureDetailsModal";
import { SelectFirstResponsableModal } from "../AdminStructures/SelectFirstResponsableModal/SelectFirstResponsableModal";
import { ImprovementsMailModal } from "./ImprovementsMailModal/ImprovementsMailModal";
import { UserDetailsModal } from "../AdminUsers/UserDetailsModal/UserDetailsModal";

import { NeedsChoiceModal } from "./NeedsChoiceModal/NeedsChoiceModal";
import { needsSelector } from "services/Needs/needs.selectors";
import Link from "next/link";
import styles from "./AdminContenu.module.scss";
import { SimplifiedDispositif, SimplifiedMainSponsor } from "types/interface";
import { ObjectId } from "mongodb";
import { statusCompare } from "lib/statusCompare";


moment.locale("fr");

export const AdminContenu = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };
  const dispositifs = useSelector(allDispositifsSelector);
  const router = useRouter();
  const locale = useRouterLocale();
  const filterQuery = router.query.filter && router.query.tab === "contenus" ?
    decodeURI(router.query.filter as string) as FilterContentStatus :
    undefined;

  const [filter, setFilter] = useState<FilterContentStatus>(filterQuery || "En attente admin");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImprovementsMailModal, setShowImprovementsMailModal] =
    useState(false);
  const [showNeedsChoiceModal, setShowNeedsChoiceModal] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [selectedDispositif, setSelectedDispositif] = useState<SimplifiedDispositif | null>(null);
  const [showChangeStructureModal, setShowChangeStructureModal] =
    useState(false);
  const [showStructureDetailsModal, setShowStructureDetailsModal] =
    useState(false);
  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [selectedStructureId, setSelectedStructureId] = useState<ObjectId | null>(null);

  const headers = table_contenu.headers;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const toggleShowChangeStructureModal = () =>
    setShowChangeStructureModal(!showChangeStructureModal);

  const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  const toggleNeedsChoiceModal = () =>
    setShowNeedsChoiceModal(!showNeedsChoiceModal);

  const toggleImprovementsMailModal = () =>
    setShowImprovementsMailModal(!showImprovementsMailModal);

  const toggleUserDetailsModal = () =>
    setShowUserDetailsModal(!showUserDetailsModal);

  const setSelectedUserIdAndToggleModal = (element: any) => {
    setSelectedUserId(element ? element._id : null);
    toggleUserDetailsModal();
  };

  const setSelectedDispositifAndToggleModal = (element: SimplifiedDispositif | null) => {
    setSelectedDispositif(element);
    toggleDetailsModal();
  };
  const allNeeds = useSelector(needsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.query.tab === "contenus") {
      router.replace({
        pathname: locale + "/backend/admin",
        search: new URLSearchParams({ tab: router.query.tab, filter: encodeURI(filter) }).toString(),
      }, undefined, { shallow: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, router.query.tab]);

  if (isLoading || dispositifs.length === 0) {
    return (
      <div className="admin-contenu animated fadeIn">
        <LoadingAdminContenu />
      </div>
    );
  }

  const getNbDispositifsByStatus = (dispositifsToDisplay: SimplifiedDispositif[], status: string) =>
    dispositifsToDisplay && dispositifsToDisplay.length > 0
      ? dispositifsToDisplay.filter((dispo) => dispo.status === status).length
      : 0;

  const filterAndSortDispositifs = (dispositifs: SimplifiedDispositif[]) => {
    const dispositifsFilteredBySearch = !!search
      ? dispositifs.filter(
          (dispo) =>
            (dispo.titreInformatif &&
              dispo.titreInformatif
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(search.toLowerCase())) ||
            (dispo.titreMarque &&
              dispo.titreMarque
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(search.toLowerCase()))
        )
      : dispositifs;

    const filteredDispositifs = dispositifsFilteredBySearch.filter(
      (dispo) => dispo.status === filter
    );
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

      const sponsorA =
        a.mainSponsor && a.mainSponsor.nom
          ? a.mainSponsor.nom.toLowerCase()
          : "";
      const sponsorB =
        b.mainSponsor && b.mainSponsor.nom
          ? b.mainSponsor.nom.toLowerCase()
          : "";

      const valueA =
        sortedHeader.orderColumn === "mainSponsor"
          ? sponsorA
          //@ts-ignore
          : a[sortedHeader.orderColumn]
          //@ts-ignore
          ? a[sortedHeader.orderColumn].toLowerCase()
          : "";
      const valueAWithoutAccent = valueA
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const valueB =
        sortedHeader.orderColumn === "mainSponsor"
          ? sponsorB
          //@ts-ignore
          : b[sortedHeader.orderColumn]
          //@ts-ignore
          ? b[sortedHeader.orderColumn].toLowerCase()
          : "";
      const valueBWithoutAccent = valueB
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (valueAWithoutAccent > valueBWithoutAccent)
        return sortedHeader.sens === "up" ? 1 : -1;

      return sortedHeader.sens === "up" ? -1 : 1;
    });
    return {
      dispositifsToDisplay,
      dispositifsForCount: dispositifsFilteredBySearch,
    };
  };
  const { dispositifsToDisplay, dispositifsForCount } =
    filterAndSortDispositifs(dispositifs);

  const reorder = (element: {name: string, order: string | null}) => {
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
      await API.exportFiches();
      setIsExportLoading(false);

      Swal.fire({
        title: "Yay...",
        text: "Export en cours",
        type: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oh non!",
        text: "Something went wrong",
        type: "error",
        timer: 1500,
      });
    }
  };

  const onFilterClick = (status: FilterContentStatus) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const setSelectedContentIdAndToggleModal = (
    element: ObjectId | null,
    _status: string | null = null
  ) => {
    const dispositif = dispositifs.find(d => d._id && d._id.toString() === element?.toString());
    if (dispositif) setSelectedDispositifAndToggleModal(dispositif || null);
  }

  const setSelectedStructureIdAndToggleModal = (element: SimplifiedMainSponsor | null) => {
    setSelectedStructureId(element ? element._id : null);
    toggleStructureDetailsModal();
  };
  const handleChange = (e: any) => setSearch(e.target.value);

  const publishDispositif = async (dispositif: SimplifiedDispositif, status = "Actif", disabled: boolean) => {
    if (disabled) return;
    const newDispositif = { status: status, dispositifId: dispositif._id };
    let question: any = { value: true };
    const link = `/${dispositif.typeContenu}/${dispositif._id}`;

    const text =
      dispositif.status === "En attente" ||
      dispositif.status === "Accepté structure"
        ? "Cette fiche n'a pas encore été validée par sa structure d'appartenance"
        : "Cette fiche sera visible par tous.";

    question = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text,

      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le valider",
      cancelButtonText: "Annuler",
    });

    if (question.value) {
      try {
        await API.updateDispositifStatus({ query: newDispositif });

        Swal.fire({
          title: "Yay...",
          text: "Contenu publié",
          type: "success",
          timer: 5500,
          footer: `<a target='_blank' href=${link}>Voir le contenu</a>`,
        });
        dispatch(fetchAllDispositifsActionsCreator());
        dispatch(fetchActiveDispositifsActionsCreator());
      } catch (error) {
        Swal.fire({
          title: "Oh non!",
          text: "Something went wrong",
          type: "error",
          timer: 1500,
        });
      }
    }
  };

  const checkIfNeedsAreCompatibleWithTags = (element: SimplifiedDispositif) => {
    if (allNeeds.length === 0) {
      return false;
    }
    if (
      !element.needs ||
      element.needs.length === 0 ||
      !element.tags ||
      element.tags.length === 0
    )
      return false;

    const formattedNeedsTheme = element.needs.map((needId) => {
      const needArray = allNeeds.filter((need) => need._id === needId);
      const needTheme = needArray.length > 0 ? needArray[0].tagName : null;
      return needTheme;
    });

    const uniqueNeedsTheme = [...new Set(formattedNeedsTheme)];
    const uniqueTags = element.tags
      .filter((tag) => !!tag)
      .map((tag) => tag.name);

    return uniqueNeedsTheme.sort().join(",") === uniqueTags.sort().join(",");
  };
  const nbNonDeletedDispositifs =
    dispositifs.length > 0
      ? dispositifs.filter((dispo) => dispo.status !== "Supprimé").length
      : 0;

  return (
    <div>
      <SearchBarContainer>
        {process.env.NEXT_PUBLIC_REACT_APP_ENV === "production" && (
          <FButton type="dark" className="mr-8" onClick={exportToAirtable}>
            {isExportLoading ? <Spinner /> : "Exporter dans Airtable"}
          </FButton>
        )}
        <CustomSearchBar
          value={search}
          onChange={handleChange}
          placeholder="Rechercher un contenu..."
          withMargin={true}
        />
        <Link
          href={"/comment-contribuer#ecrire"}
          passHref
        >
          <FButton
            type="dark"
            name="plus-circle-outline"
            tag={"a"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ajouter un contenu
          </FButton>
        </Link>
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
          <StyledTitle>Contenus</StyledTitle>
          <FigureContainer>{nbNonDeletedDispositifs}</FigureContainer>
        </div>
        <StyledSort marginTop="8px">
          {correspondingStatus.sort(statusCompare).map((status) => {
            const nbContent = getNbDispositifsByStatus(
              dispositifsForCount,
              status.storedStatus
            );
            return (
              <FilterButton
                key={status.storedStatus}
                onClick={() => onFilterClick(status.storedStatus)}
                text={`${status.displayedStatus} (${nbContent})`}
                isSelected={filter === status.storedStatus}
              />
            );
          })}
        </StyledSort>
      </StyledHeader>

      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {headers.map((element: { name: string, order: string | null }, key) => (
                <th key={key} onClick={() => reorder(element)}>
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
            {dispositifsToDisplay.map((element, key) => {
              const nbDays = element.lastModificationDate
                ? -moment(element.lastModificationDate).diff(moment(), "days") +
                  " jours"
                : "ND";
              const burl =
                "/" + (element.typeContenu || "dispositif") + "/" + element._id;
              const validationDisabled =
                element.status === "Actif" ||
                !element.mainSponsor ||
                element.mainSponsor.status !== "Actif";

              const areNeedsCompatibleWithTags =
                checkIfNeedsAreCompatibleWithTags(element);

              return (
                <tr key={key}>
                  <td
                    className="align-middle"
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <TypeContenu
                      type={element.typeContenu || "dispositif"}
                      isDetailedVue={false}
                    />
                  </td>
                  <td className="align-middle">
                    <div className={styles.row}>
                      <ColoredRound
                        color={
                          areNeedsCompatibleWithTags
                            ? colors.validationHover
                            : colors.error
                        }
                      />
                      {element.needs ? element.needs.length : 0}
                    </div>
                  </td>
                  <td
                    className="align-middle"
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <Title
                      titreInformatif={element.titreInformatif}
                      titreMarque={element.titreMarque || null}
                    />
                  </td>
                  <td
                    className="align-middle cursor-pointer"
                    onClick={() =>
                      setSelectedStructureIdAndToggleModal(element.mainSponsor)
                    }
                  >
                    <Structure sponsor={element.mainSponsor} />
                  </td>
                  <td
                    className={"align-middle "}
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    {nbDays}
                  </td>
                  <td
                    className="align-middle"
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {element.adminProgressionStatus ? (
                        <div style={{ marginRight: "8px" }}>
                          <StyledStatus text={element.adminProgressionStatus} />
                        </div>
                      ) : (
                        <div style={{ marginRight: "8px" }}>
                          <StyledStatus text="Nouveau !" />
                        </div>
                      )}
                      {element.adminPercentageProgressionStatus && (
                        <StyledStatus
                          text={element.adminPercentageProgressionStatus}
                        />
                      )}
                    </div>
                  </td>
                  <td
                    className="align-middle"
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <StyledStatus text={element.status} />
                  </td>
                  <td className="align-middle">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <SeeButton burl={burl} />
                      <ValidateButton
                        onClick={() =>
                          publishDispositif(
                            element,
                            "Actif",
                            validationDisabled
                          )
                        }
                        disabled={validationDisabled}
                      />
                      <DeleteButton
                        onClick={() =>
                          prepareDeleteContrib(
                            setSelectedDispositif,
                            setShowDetailsModal,
                            fetchAllDispositifsActionsCreator,
                            dispatch,
                            element
                          )
                        }
                        disabled={element.status === "Supprimé"}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
      <DetailsModal
        show={showDetailsModal}
        toggleModal={() => setSelectedDispositifAndToggleModal(null)}
        setSelectedStructureIdAndToggleModal={
          setSelectedStructureIdAndToggleModal
        }
        selectedDispositifId={
          selectedDispositif ? selectedDispositif._id : null
        }
        onDeleteClick={() =>
          prepareDeleteContrib(
            setSelectedDispositif,
            setShowDetailsModal,
            fetchAllDispositifsActionsCreator,
            dispatch,
            selectedDispositif
          )
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
          selectedDispositifId={
            selectedDispositif ? selectedDispositif._id : null
          }
        />
      )}
      <UserDetailsModal
        show={showUserDetailsModal}
        toggleModal={() => setSelectedUserIdAndToggleModal(null)}
        selectedUserId={selectedUserId}
        setSelectedStructureIdAndToggleModal={
          setSelectedStructureIdAndToggleModal
        }
      />

      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedDispositif ? selectedDispositif._id : null}
        dispositifStatus={selectedDispositif ? selectedDispositif.status : null}
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
          toggle={toggleNeedsChoiceModal}
          dispositifId={selectedDispositif ? selectedDispositif._id : null}
        />
      )}
    </div>
  );
};
