import React, { useEffect } from "react";
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
// import { CustomSearchBar } from "../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
// import FButton from "../../../components/FigmaUI/FButton/FButton";
// import { DetailsModal } from "./DetailsModal/DetailsModal";
// import { ChangeStructureModal } from "./ChangeStructureModale/ChangeStructureModale";

moment.locale("fr");
declare const window: Window;

export const AdminStructures = () => {
  // test
  // const defaultSortedHeader = {
  //   name: "none",
  //   sens: "none",
  //   orderColumn: "none",
  // };

  //   const [filter, setFilter] = useState("En attente admin");
  //   const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  //   const [search, setSearch] = useState("");
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
                    // reorder(element)
                  }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    isSortedHeader={true}
                    sens="up"
                    // isSortedHeader={sortedHeader.name === element.name}
                    // sens={
                    //   sortedHeader.name === element.name
                    //     ? sortedHeader.sens
                    //     : "down"
                    // }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {structures.map((element, key) => {
              // const nbDays =
              //   -moment(element.updatedAt).diff(moment(), "days") + " jours";
              // const burl =
              //   url + (element.typeContenu || "dispositif") + "/" + element._id;

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
                    Responsable
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

//   const filterAndSortDispositifs = (dispositifs) => {
//     const dispositifsFilteredBySearch = !!search
//       ? dispositifs.filter(
//           (dispo) =>
//             dispo.titreInformatif &&
//             dispo.titreInformatif
//               .normalize("NFD")
//               .replace(/[\u0300-\u036f]/g, "")
//               .toLowerCase()
//               .includes(search)
//         )
//       : dispositifs;

//     const filteredDispositifs = dispositifsFilteredBySearch.filter(
//       (dispo) => dispo.status === filter
//     );
//     if (sortedHeader.name === "none")
//       return {
//         dispositifsToDisplay: filteredDispositifs,
//         dispositifsForCount: dispositifsFilteredBySearch,
//       };

//     const dispositifsToDisplay = filteredDispositifs.sort((a, b) => {
//       const sponsorA =
//         a.mainSponsor && a.mainSponsor.nom
//           ? a.mainSponsor.nom.toLowerCase()
//           : "";
//       const sponsorB =
//         b.mainSponsor && b.mainSponsor.nom
//           ? b.mainSponsor.nom.toLowerCase()
//           : "";

//       const valueA =
//         sortedHeader.orderColumn === "mainSponsor"
//           ? sponsorA
//           : a[sortedHeader.orderColumn]
//           ? a[sortedHeader.orderColumn].toLowerCase()
//           : "";
//       const valueAWithoutAccent = valueA
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "");
//       const valueB =
//         sortedHeader.orderColumn === "mainSponsor"
//           ? sponsorB
//           : b[sortedHeader.orderColumn]
//           ? b[sortedHeader.orderColumn].toLowerCase()
//           : "";
//       const valueBWithoutAccent = valueB
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "");

//       if (valueAWithoutAccent > valueBWithoutAccent)
//         return sortedHeader.sens === "up" ? 1 : -1;

//       return sortedHeader.sens === "up" ? -1 : 1;
//     });
//     return {
//       dispositifsToDisplay,
//       dispositifsForCount: dispositifsFilteredBySearch,
//     };
//   };
//   const {
//     dispositifsToDisplay,
//     dispositifsForCount,
//   } = filterAndSortDispositifs(dispositifs);

//   const reorder = (element) => {
//     if (sortedHeader.name === element.name) {
//       const sens = sortedHeader.sens === "up" ? "down" : "up";
//       setSortedHeader({ name: element.name, sens, orderColumn: element.order });
//     } else {
//       setSortedHeader({
//         name: element.name,
//         sens: "up",
//         orderColumn: element.order,
//       });
//     }
//   };

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
