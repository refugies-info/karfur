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
import marioProfile from "../../../../assets/mario-profile.jpg";
import {
  // StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
  // SearchBarContainer,
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
} from "../sharedComponents/SubComponents";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import { headers } from "./data";
import {
  RowContainer,
  StructureName,
} from "./components/AdminStructureComponents";
import { SimplifiedStructureForAdmin } from "../../../../@types/interface";

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
  //   const [showDetailsModal, setShowDetailsModal] = useState(false);
  //   const [selectedDispositif, setSelectedDispositif] = useState(null);
  //   const [showChangeStructureModal, setShowChangeStructureModal] = useState(
  //     false
  //   );
  //   const headers = table_contenu.headers;
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  //   const toggleShowChangeStructureModal = () =>
  //     setShowChangeStructureModal(!showChangeStructureModal);
  //   const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);
  //   const setSelectedDispositifAndToggleModal = (element) => {
  //     setSelectedDispositif(element);
  //     toggleDetailsModal();
  //   };
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
  const { structuresToDisplay, structuresForCount } = filterAndSortStructures(
    structures
  );

  const nbNonDeletedStructures = structures.filter(
    (structure) => structure.status !== "Supprimé"
  ).length;
  return (
    <div className="admin-structures">
      <StyledHeader>
        <StyledTitle>Structures</StyledTitle>
        <FigureContainer>{nbNonDeletedStructures}</FigureContainer>
        {/* <StyledSort>
          {correspondingStatus.sort(compare).map((status) => {
            const nbContent = getNbDispositifsByStatus(
              structuresForCount,
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
        </StyledSort> */}
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
            {structuresToDisplay.map((element, key) => {
              const responsableName = element.responsable
                ? element.responsable.username
                : "Aucun responsable";
              const responsableSecureUrl =
                element.responsable &&
                element.responsable.picture &&
                element.responsable.picture.secure_url
                  ? element.responsable.picture.secure_url
                  : marioProfile;
              return (
                <tr key={key}>
                  <td
                    className="align-middle"
                    // onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
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
                  <td
                    className="align-middle"
                    // onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <StyledStatus
                      text={element.status}
                      textToDisplay={
                        element.status === "Actif"
                          ? "Active"
                          : element.status === "Supprimé"
                          ? "Supprimée"
                          : "En attente"
                      }
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
                    {element.nbMembres}
                  </td>
                  <td
                    className={"align-middle "}
                    // onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    <RowContainer>
                      {element.responsable && (
                        <img
                          className="respo-img mr-8"
                          src={responsableSecureUrl}
                        />
                      )}
                      {responsableName}
                    </RowContainer>
                  </td>
                  <td
                    className="align-middle"
                    // onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    {element.dispositifsAssocies.length}
                  </td>
                  <td
                    className="align-middle"
                    // onClick={() => setSelectedDispositifAndToggleModal(element)}
                  >
                    {moment(element.created_at).format("lll")}
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

//   const getNbDispositifsByStatus = (dispositifsToDisplay, status) =>
//     dispositifsToDisplay && dispositifsToDisplay.length > 0
//       ? dispositifsToDisplay.filter((dispo) => dispo.status === status).length
//       : 0;

//   const prepareDeleteContrib = function (dispositif) {
//     Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text: "La suppression d'un dispositif est irréversible",
//       type: "question",
//       showCancelButton: true,
//       confirmButtonColor: colors.rouge,
//       cancelButtonColor: colors.vert,
//       confirmButtonText: "Oui, le supprimer",
//       cancelButtonText: "Annuler",
//     }).then((result) => {
//       if (result.value) {
//         const newDispositif = {
//           dispositifId: dispositif._id,
//           status: "Supprimé",
//         };

//         API.updateDispositifStatus({ query: newDispositif })
//           .then(() => {
//             Swal.fire({
//               title: "Yay...",
//               text: "Suppression effectuée",
//               type: "success",
//               timer: 1500,
//             });
//             setSelectedDispositif(null);
//             setShowDetailsModal(false);
//             dispatch(fetchAllDispositifsActionsCreator());
//           })
//           .catch(() => {
//             Swal.fire({
//               title: "Oh non!",
//               text: "Something went wrong",
//               type: "error",
//               timer: 1500,
//             });
//           });
//       }
//     });
//   };

//   const onFilterClick = (status) => {
//     setFilter(status);
//     setSortedHeader(defaultSortedHeader);
//   };

//   const handleChange = (e) => setSearch(e.target.value);

//   const publishDispositif = async (dispositif, status = "Actif") => {
//     const newDispositif = { status: status, dispositifId: dispositif._id };
//     let question = { value: true };
//     const link = `${url}${dispositif.typeContenu}/${dispositif._id}`;

//     if (
//       dispositif.status === "En attente" ||
//       dispositif.status === "Accepté structure"
//     ) {
//       question = await Swal.fire({
//         title: "Êtes-vous sûr ?",
//         text:
//           "Ce dispositif n'a pas encore été validé par sa structure d'appartenance",
//         type: "question",
//         showCancelButton: true,
//         confirmButtonColor: colors.rouge,
//         cancelButtonColor: colors.vert,
//         confirmButtonText: "Oui, le valider",
//         cancelButtonText: "Annuler",
//       });
//     }
//     if (question.value) {
//       API.updateDispositifStatus({ query: newDispositif })
//         .then(() => {
//           Swal.fire({
//             title: "Yay...",
//             text: "Contenu publié",
//             type: "success",
//             timer: 5500,
//             footer: `<a target='_blank' href=${link}>Voir le contenu</a>`,
//           });
//           dispatch(fetchAllDispositifsActionsCreator());
//           dispatch(fetchActiveDispositifsActionsCreator());
//         })
//         .catch(() => {
//           Swal.fire({
//             title: "Oh non!",
//             text: "Something went wrong",
//             type: "error",
//             timer: 1500,
//           });
//         });
//     }
//   };

//   const nbNonDeletedDispositifs =
//     dispositifs.length > 0
//       ? dispositifs.filter((dispo) => dispo.status !== "Supprimé").length
//       : 0;
{
  /* <SearchBarContainer>
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
      

      <Content>
        <Table responsive borderless>
         
          
        </Table>
      </Content>
      <DetailsModal
        show={showDetailsModal}
        toggleModal={() => setSelectedDispositifAndToggleModal(null)}
        selectedDispositifId={
          selectedDispositif ? selectedDispositif._id : null
        }
        url={url}
        onDeleteClick={() => prepareDeleteContrib(selectedDispositif)}
        setShowChangeStructureModal={setShowChangeStructureModal}
      />
      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedDispositif ? selectedDispositif._id : null}
        dispositifStatus={selectedDispositif ? selectedDispositif.status : null}
      /> */
}
