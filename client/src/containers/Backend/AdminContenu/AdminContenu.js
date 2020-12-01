import React, { useEffect, useState } from "react";
import { Table, Input, Tooltip, Spinner } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import moment from "moment/min/moment-with-locales";
import _ from "lodash";
import Swal from "sweetalert2";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import {
  fetchAllDispositifsActionsCreator,
  setAllDispositifsActionsCreator,
} from "../../../services/AllDispositifs/allDispositifs.actions";
import { fetchActiveDispositifsActionsCreator } from "../../../services/ActiveDispositifs/activeDispositifs.actions";
import { deleteContrib } from "../UserProfile/functions";
import { colorStatut } from "../../../components/Functions/ColorFunctions";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import {
  table_contenu,
  status_mapping,
  responsables,
  internal_actions,
  status_sort_arr,
  correspondingStatus,
} from "./data";
import { customCriteres } from "../../Dispositif/MoteurVariantes/data";
import API from "../../../utils/API";
import {
  StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
  FigureContainer,
} from "./StyledAdminContenu";
import produce from "immer";

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
import { fetchAllDispositifs } from "../../../services/AllDispositifs/allDispositifs.saga";

moment.locale("fr");

const url =
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.REACT_APP_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";

export const AdminContenu = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none",
  };
  const [filter, setFilter] = useState("En attente admin");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const headers = table_contenu.headers;
  const dispositifs = useSelector(allDispositifsSelector);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const loadDispositifs = async () => {
      await dispatch(fetchAllDispositifsActionsCreator());
    };
    loadDispositifs();

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

  const getNbDispositifsByStatus = (status) =>
    dispositifs.length > 0
      ? dispositifs.filter((dispo) => dispo.status === status).length
      : 0;

  const filterAndSortDispositifs = (dispositifs) => {
    const filteredDispositifs = dispositifs.filter(
      (dispo) => dispo.status === filter
    );
    if (sortedHeader.name === "none") return filteredDispositifs;

    return filteredDispositifs.sort((a, b) => {
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
  };
  const dispositifsToDisplay = filterAndSortDispositifs(dispositifs);

  const compare = (a, b) => {
    const orderA = a.order;
    const orderB = b.order;
    return orderA > orderB ? 1 : -1;
  };

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

  const publishDispositif = async (dispositif, status = "Actif") => {
    const newDispositif = { status: status, dispositifId: dispositif._id };
    let question = { value: true };
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
            text: "Dispositif publié",
            type: "success",
            timer: 1500,
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

  return (
    <div className="admin-contenu animated fadeIn">
      <StyledHeader>
        <StyledTitle>Contenus</StyledTitle>
        <FigureContainer>{dispositifs.length}</FigureContainer>
        <StyledSort>
          {correspondingStatus.sort(compare).map((status) => {
            const nbContent = getNbDispositifsByStatus(status.storedStatus);
            return (
              <FilterButton
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
                  <td className="align-middle">
                    <TypeContenu type={element.typeContenu || "dispositif"} />
                  </td>
                  <td className="align-middle" id={"titre-" + key}>
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
                  <td className={"align-middle "}>{nbDays}</td>
                  <td className="align-middle">
                    <StyledStatus text="Nouveau" />
                  </td>
                  <td className="align-middle ">
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
                      />
                    </div>
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

// const mapStateToProps = (state) => {
//   return { dispositifs: state.dispositif.dispositifs };
// };

// const mapDispatchToProps = { fetchDispositifs: fetchDispositifsActionCreator };

// export default connect(mapStateToProps, mapDispatchToProps)(AdminContenu);

// constructor(props) {
//   super(props);
//   this.deleteContrib = deleteContrib.bind(this);
//   this.prepareDeleteContrib = prepareDeleteContrib.bind(this);
// }

// state = {
//   dispositifs: [],
//   deleted: false,
//   published: false,
//   draft: false,
//   headers: table_contenu.headers,
// };

// componentDidMount() {
//   this.props.fetchDispositifs();
//   // this._initializeContrib(this.props);
// }

// formatDispositif = (dispositifs) =>
//   dispositifs.map((x) => ({
//     ...x,
//     titreCourt: x.titreMarque || x.titreInformatif || "",
//     titre:
//       (x.titreMarque || "") +
//       (x.titreMarque && x.titreInformatif ? " - " : "") +
//       (x.titreInformatif || ""),
//     structure: _.get(x, "mainSponsor.nom", _.get(x, "mainSponsor.nom", "")),
//     structureObj: _.get(x, "mainSponsor", {}),
//     expanded: false,
//     type: "parent",
//     tooltip: false,
//     joursDepuis:
//       (new Date().getTime() - new Date(x.updatedAt).getTime()) /
//       (1000 * 3600 * 24),
//   }));

// _initializeContrib = () => {
//   API.get_dispositif({ query: {}, populate: "creatorId mainSponsor" }).then(
//     (data_res) => {
//       const dispositifs = [...data_res.data.data];
//       this.setState({
//         dispositifs: this.formatDispositif(dispositifs).sort(function (a, b) {
//           const statusA = a.status;
//           const statusB = b.status;
//           const correspondencyStatusA = _.find(
//             prioritaryStatus,
//             (status) => status.name === statusA
//           );
//           const prioStatusA = correspondencyStatusA
//             ? correspondencyStatusA.prio
//             : 5;
//           const correspondencyStatusB = _.find(
//             prioritaryStatus,
//             (status) => status.name === statusB
//           );
//           const prioStatusB = correspondencyStatusB
//             ? correspondencyStatusB.prio
//             : 5;

//           return prioStatusA < prioStatusB
//             ? -1
//             : prioStatusA > prioStatusB
//             ? 1
//             : 0;
//         }),
//       });
//     }
//   );
// };

const toggleExpanded = (idx) => {
  // let dispositifs = [...this.state.dispositifs]
  //   .map((x, i) =>
  //     i === idx
  //       ? [
  //           { ...x, expanded: !x.expanded },
  //           ...(!x.expanded
  //             ? x.children.map((y) => ({ ...y, type: "child", children: [] }))
  //             : []),
  //         ]
  //       : [x]
  //   )
  //   .reduce((a, b) => a.concat(b), []);
  // if (this.state.dispositifs[idx].expanded) {
  //   dispositifs = dispositifs.filter(
  //     (x) => x.demarcheId !== this.state.dispositifs[idx]._id
  //   );
  // }
  // this.setState({ dispositifs });
};

const reorder = (key, element) => {
  // const croissant = !element.croissant;
  // this.setState((pS) => ({
  //   dispositifs: pS.dispositifs.sort((a, b) => {
  //     let aValue = _.get(a, element.order),
  //       bValue = _.get(b, element.order);
  //     if (element.order === "status") {
  //       aValue = _.indexOf(status_sort_arr, aValue);
  //       bValue = _.indexOf(status_sort_arr, bValue);
  //     }
  //     return aValue > bValue
  //       ? croissant
  //         ? 1
  //         : -1
  //       : aValue < bValue
  //       ? croissant
  //         ? -1
  //         : 1
  //       : 0;
  //   }),
  //   headers: pS.headers.map((x, i) =>
  //     i === key
  //       ? { ...x, croissant: !x.croissant, active: true }
  //       : { ...x, active: false }
  //   ),
  // }));
};

// const toggleTooltip = (idx) =>
// this.setState((pS) => ({
//   dispositifs: pS.dispositifs.map((x, i) =>
//     i === idx ? { ...x, tooltip: !x.tooltip } : x
//   ),
// }));

// const handleChange = (e, idx, dispositif) => {
//   const target = e.target;
//   const newDispositif = {
//     [target.id]: target.value,
//     dispositifId: dispositif._id,
//     status: dispositif.status,
//   };
//   API.add_dispositif(newDispositif);
//   // this.setState((pS) => ({
//   //   dispositifs: pS.dispositifs.map((x, i) =>
//   //     i === idx ? { ...x, [target.id]: target.value } : x
//   //   ),
//   // }));
// };

// const update_status = async (dispositif, status = "Actif") => {
//   const newDispositif = { status: status, dispositifId: dispositif._id };
//   let question = { value: true };
//   if (
//     dispositif.status === "En attente" ||
//     dispositif.status === "Accepté structure"
//   ) {
//     question = await Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text:
//         "Ce dispositif n'a pas encore été validé par sa structure d'appartenance",
//       type: "question",
//       showCancelButton: true,
//       confirmButtonColor: variables.rouge,
//       cancelButtonColor: variables.vert,
//       confirmButtonText: "Oui, le valider",
//       cancelButtonText: "Annuler",
//     });
//   }
//   if (question.value) {
//     API.add_dispositif(newDispositif).then(() => {
//       // this.setState((pS) => ({
//       //   dispositifs: pS.dispositifs.map((x) =>
//       //     x._id === dispositif._id ? { ...x, status: status } : x
//       //   ),
//       // }));
//     });
//   }
// };

const reorderOnTopPubblish = () => {
  // this.setState(
  //   produce((draft) => {
  //     draft.published = !this.state.published;
  //     if (!this.state.published) {
  //       draft.dispositifs.sort((a, b) => {
  //         if (a.status === "Actif" && b.status === "Actif") {
  //           return 0;
  //         } else if (a.status === "Actif" && b.status !== "Actif") {
  //           return -1;
  //         }
  //         return 1;
  //       });
  //     }
  //   })
  // );
};

const reorderOnTopDraft = () => {
  // this.setState(
  //   produce((draft) => {
  //     draft.draft = !this.state.draft;
  //     if (!this.state.draft) {
  //       draft.dispositifs.sort((a, b) => {
  //         if (a.status === "Brouillon" && b.status === "Brouillon") {
  //           return 0;
  //         } else if (a.status === "Brouillon" && b.status !== "Brouillon") {
  //           return -1;
  //         }
  //         return 1;
  //       });
  //     }
  //   })
  // );
};

const reorderOnTopDeleted = () => {
  // this.setState(
  //   produce((draft) => {
  //     draft.deleted = !this.state.deleted;
  //     if (!this.state.deleted) {
  //       draft.dispositifs.sort((a, b) => {
  //         if (a.status === "Supprimé" && b.status === "Supprimé") {
  //           return 0;
  //         } else if (a.status === "Supprimé" && b.status !== "Supprimé") {
  //           return -1;
  //         }
  //         return 1;
  //       });
  //     }
  //   })
  // );
};

// console.log("dispo", props.dispositifs);
// const { dispositifs, headers } = this.state;
