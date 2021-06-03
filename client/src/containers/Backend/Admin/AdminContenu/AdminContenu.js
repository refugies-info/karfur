import React, { useState } from "react";
import { Table, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import { fetchAllDispositifsActionsCreator } from "../../../../services/AllDispositifs/allDispositifs.actions";
import { fetchActiveDispositifsActionsCreator } from "../../../../services/ActiveDispositifs/activeDispositifs.actions";

import { table_contenu, correspondingStatus } from "./data";
import API from "../../../../utils/API";
import {
  StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  SearchBarContainer,
} from "../sharedComponents/StyledAdmin";
import { colors } from "colors";
import { allDispositifsSelector } from "../../../../services/AllDispositifs/allDispositifs.selector";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
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
} from "../sharedComponents/SubComponents";
import { CustomSearchBar } from "../../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { DetailsModal } from "./DetailsModal/DetailsModal";
import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";
import { StructureDetailsModal } from "../AdminStructures/StructureDetailsModal/StructureDetailsModal";
import { SelectFirstResponsableModal } from "../AdminStructures/SelectFirstResponsableModal/SelectFirstResponsableModal";
import { ImprovementsMailModal } from "./ImprovementsMailModal/ImprovementsMailModal";

moment.locale("fr");

export const compare = (a, b) => {
  const orderA = a.order;
  const orderB = b.order;
  return orderA > orderB ? 1 : -1;
};
export const AdminContenu = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };
  const dispositifs = useSelector(allDispositifsSelector);

  const [filter, setFilter] = useState("En attente admin");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImprovementsMailModal, setShowImprovementsMailModal] = useState(
    false
  );
  const [isExportLoading, setIsExportLoading] = useState(false);

  const [selectedDispositif, setSelectedDispositif] = useState(null);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(
    false
  );
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(
    false
  );
  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [selectedStructureId, setSelectedStructureId] = useState(null);

  const headers = table_contenu.headers;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const toggleShowChangeStructureModal = () =>
    setShowChangeStructureModal(!showChangeStructureModal);

  const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  const toggleImprovementsMailModal = () =>
    setShowImprovementsMailModal(!showImprovementsMailModal);

  const setSelectedDispositifAndToggleModal = (element) => {
    setSelectedDispositif(element);
    toggleDetailsModal();
  };

  if (isLoading || dispositifs.length === 0) {
    return (
      <div className="admin-contenu animated fadeIn">
        <LoadingAdminContenu />
      </div>
    );
  }

  const getNbDispositifsByStatus = (dispositifsToDisplay, status) =>
    dispositifsToDisplay && dispositifsToDisplay.length > 0
      ? dispositifsToDisplay.filter((dispo) => dispo.status === status).length
      : 0;

  const filterAndSortDispositifs = (dispositifs) => {
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
          : a[sortedHeader.orderColumn]
          ? a[sortedHeader.orderColumn].toLowerCase()
          : "";
      const valueAWithoutAccent = valueA
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const valueB =
        sortedHeader.orderColumn === "mainSponsor"
          ? sponsorB
          : b[sortedHeader.orderColumn]
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
  const {
    dispositifsToDisplay,
    dispositifsForCount,
  } = filterAndSortDispositifs(dispositifs);

  const reorder = (element) => {
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

  const dispatch = useDispatch();

  const prepareDeleteContrib = (dispositif) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        const newDispositif = {
          dispositifId: dispositif._id,
          status: "Supprimé",
        };

        API.updateDispositifStatus({ query: newDispositif })
          .then(() => {
            Swal.fire({
              title: "Yay...",
              text: "Suppression effectuée",
              type: "success",
              timer: 1500,
            });
            setSelectedDispositif(null);
            setShowDetailsModal(false);
            dispatch(fetchAllDispositifsActionsCreator());
          })
          .catch(() => {
            Swal.fire({
              title: "Oh non!",
              text: "Something went wrong",
              type: "error",
              timer: 1500,
            });
          });
      }
    });
  };

  const onFilterClick = (status) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const toggleStructureDetailsModal = () =>
    setShowStructureDetailsModal(!showStructureDetailsModal);

  const setSelectedStructureIdAndToggleModal = (element) => {
    setSelectedStructureId(element ? element._id : null);
    toggleStructureDetailsModal();
  };
  const handleChange = (e) => setSearch(e.target.value);

  const publishDispositif = async (dispositif, status = "Actif", disabled) => {
    if (disabled) return;
    const newDispositif = { status: status, dispositifId: dispositif._id };
    let question = { value: true };
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
  const nbNonDeletedDispositifs =
    dispositifs.length > 0
      ? dispositifs.filter((dispo) => dispo.status !== "Supprimé").length
      : 0;

  return (
    <div>
      <SearchBarContainer>
        {
          <FButton type="dark" className="mr-8" onClick={exportToAirtable}>
            {isExportLoading ? <Spinner /> : "Exporter dans Airtable"}
          </FButton>
        }
        <CustomSearchBar
          value={search}
          onChange={handleChange}
          placeholder="Rechercher un contenu..."
          withMargin={true}
        />
        <FButton
          type="dark"
          name="plus-circle-outline"
          tag={"a"}
          href={"/comment-contribuer#ecrire"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ajouter un contenu
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
          <StyledTitle>Contenus</StyledTitle>
          <FigureContainer>{nbNonDeletedDispositifs}</FigureContainer>
        </div>
        <StyledSort marginTop="8px">
          {correspondingStatus.sort(compare).map((status) => {
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
              {headers.map((element, key) => (
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
                  <td
                    className="align-middle"
                    onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <Title
                      titreInformatif={element.titreInformatif}
                      titreMarque={element.titreMarque}
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
                        hoverColor={colors.validationHover}
                      />
                      <DeleteButton
                        onClick={() => prepareDeleteContrib(element)}
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
        selectedDispositifId={
          selectedDispositif ? selectedDispositif._id : null
        }
        onDeleteClick={() => prepareDeleteContrib(selectedDispositif)}
        setShowChangeStructureModal={setShowChangeStructureModal}
        toggleImprovementsMailModal={toggleImprovementsMailModal}
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
        />
      )}
      {selectedStructureId && (
        <SelectFirstResponsableModal
          show={showSelectFirstRespoModal}
          toggleModal={() => setSelectFirstRespoModal(false)}
          selectedStructureId={selectedStructureId}
        />
      )}
    </div>
  );
};
