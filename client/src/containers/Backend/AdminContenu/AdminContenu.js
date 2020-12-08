import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import {
  fetchAllDispositifsActionsCreator,
  setAllDispositifsActionsCreator,
} from "../../../services/AllDispositifs/allDispositifs.actions";
import { fetchActiveDispositifsActionsCreator } from "../../../services/ActiveDispositifs/activeDispositifs.actions";
import { table_contenu, correspondingStatus } from "./data";
import API from "../../../utils/API";
import {
  StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  SearchBarContainer,
} from "./StyledAdminContenu";
import "./AdminContenu.scss";
import variables from "scss/colors.scss";
import { allDispositifsSelector } from "../../../services/AllDispositifs/allDispositifs.selector";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
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
} from "./components/SubComponents";
import { CustomSearchBar } from "../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { DetailsModal } from "./DetailsModal/DetailsModal";
import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";

moment.locale("fr");

const url =
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.REACT_APP_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";
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
  const [selectedDispositif, setSelectedDispositif] = useState(null);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(
    false
  );
  const headers = table_contenu.headers;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const toggleShowChangeStructureModal = () =>
    setShowChangeStructureModal(!showChangeStructureModal);
  const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  const setSelectedDispositifAndToggleModal = (element) => {
    setSelectedDispositif(element);
    toggleDetailsModal();
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const loadDispositifs = async () => {
      await dispatch(fetchAllDispositifsActionsCreator());
    };
    loadDispositifs();
    window.scrollTo(0, 0);

    return () => {
      dispatch(setAllDispositifsActionsCreator([]));
    };
  }, [dispatch]);

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
            dispo.titreInformatif &&
            dispo.titreInformatif
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(search)
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

  const prepareDeleteContrib = function (dispositif) {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: variables.rouge,
      cancelButtonColor: variables.vert,
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

  const handleChange = (e) => setSearch(e.target.value);

  const publishDispositif = async (dispositif, status = "Actif") => {
    const newDispositif = { status: status, dispositifId: dispositif._id };
    let question = { value: true };
    const link = `${url}${dispositif.typeContenu}/${dispositif._id}`;

    if (
      dispositif.status === "En attente" ||
      dispositif.status === "Accepté structure"
    ) {
      question = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text:
          "Ce dispositif n'a pas encore été validé par sa structure d'appartenance",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: variables.rouge,
        cancelButtonColor: variables.vert,
        confirmButtonText: "Oui, le valider",
        cancelButtonText: "Annuler",
      });
    }
    if (question.value) {
      API.updateDispositifStatus({ query: newDispositif })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Contenu publié",
            type: "success",
            timer: 5500,
            footer: `<a target='_blank' href=${link}>Voir le contenu</a>`,
          });
          dispatch(fetchAllDispositifsActionsCreator());
          dispatch(fetchActiveDispositifsActionsCreator());
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
  };

  // const testData = {
  //   created_at: "2020-03-22T20:34:51.001Z",
  //   mainSponsor: {
  //     _id: "5e7f49e70f3ff1005039a62b",
  //     nom: "Ovale citoyen",
  //     status: "En attente",
  //   },
  //   publishedAt: "2020-11-19T09:58:27.922Z",
  //   status: "En attente admin",
  //   titreInformatif: "Faire du sport",
  //   titreMarque: "Ovale citoyen",
  //   typeContenu: "dispositif",
  //   updatedAt: "2020-11-19T09:58:27.923Z",
  //   _id: "5e77cbea0c9490004e55c85a",
  // };

  // const testData = {
  //   created_at: "2020-03-17T14:16:44.499Z",
  //   creatorId: {
  //     username: "reloref",
  //     picture: {
  //       imgId: "5dd79f5ce4054f004bef473f",
  //       public_id: "pictures/rmlyfsabn1qxfcamv903",
  //       secure_url:
  //         "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1574412123/pictures/rmlyfsabn1qxfcamv903.jpg",
  //     },
  //     _id: "5dceb0e08a87590016672650",
  //   },
  //   mainSponsor: {
  //     _id: "5d7fc545cc60d900163317e1",
  //     nom: "France Terre d'Asile",
  //     status: "Actif",
  //     picture: {
  //       imgId: "5dd79f5ce4054f004bef473f",
  //       public_id: "pictures/rmlyfsabn1qxfcamv903",
  //       secure_url:
  //         "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1574412123/pictures/rmlyfsabn1qxfcamv903.jpg",
  //     },
  //   },
  //   status: "En attente admin",
  //   titreInformatif: "Je découvre le marché du travail en France",
  //   typeContenu: "demarche",
  //   updatedAt: "2020-07-20T08:44:36.233Z",
  //   _id: "5e70dbccdea008004e985e59",
  // };

  const nbNonDeletedDispositifs =
    dispositifs.length > 0
      ? dispositifs.filter((dispo) => dispo.status !== "Supprimé").length
      : 0;
  return (
    <div className="admin-contenu animated fadeIn">
      <SearchBarContainer>
        <CustomSearchBar
          value={search}
          onChange={handleChange}
          placeholder="Rechercher un contenu..."
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
        <StyledTitle>Contenus</StyledTitle>
        <FigureContainer>{nbNonDeletedDispositifs}</FigureContainer>
        <StyledSort>
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
              const nbDays =
                -moment(element.updatedAt).diff(moment(), "days") + " jours";
              const burl =
                url + (element.typeContenu || "dispositif") + "/" + element._id;

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
                    // onClick={() =>
                    //   this.props.onSelect(
                    //     { structure: element.structureObj },
                    //     "1"
                    //   )
                    // }
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
                    <StyledStatus text="Nouveau" />
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
                        onClick={() => publishDispositif(element)}
                        disabled={
                          element.status === "Actif" ||
                          !element.mainSponsor ||
                          element.mainSponsor.status !== "Actif"
                        }
                        hoverColor={variables.validationHover}
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
        selectedDispositif={selectedDispositif}
        url={url}
        onDeleteClick={() => prepareDeleteContrib(selectedDispositif)}
        setShowChangeStructureModal={setShowChangeStructureModal}
      />
      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedDispositif ? selectedDispositif._id : null}
        dispositifStatus={selectedDispositif ? selectedDispositif.status : null}
      />
    </div>
  );
};
