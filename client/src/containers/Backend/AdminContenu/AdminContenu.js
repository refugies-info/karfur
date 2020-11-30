import React, { Component, useEffect } from "react";
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
import { deleteContrib } from "../UserProfile/functions";
import { colorStatut } from "../../../components/Functions/ColorFunctions";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import {
  table_contenu,
  status_mapping,
  responsables,
  internal_actions,
  status_sort_arr,
} from "./data";
import { prepareDeleteContrib } from "../AdminContrib/functions";
import { customCriteres } from "../../Dispositif/MoteurVariantes/data";
import API from "../../../utils/API";
import {
  StyledSort,
  StyledTitle,
  StyledHeader,
  Content,
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
} from "./components/SubComponents";

moment.locale("fr");
const prioritaryStatus = [
  { name: "En attente", prio: 1 },
  { name: "En attente admin", prio: 0 },
  { name: "Accepté structure", prio: 2 },
  { name: "En attente non prioritaire", prio: 3 },
  { name: "Rejecté structure", prio: 4 },
];

const url =
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.REACT_APP_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";

export const AdminContenu = () => {
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

  if (isLoading) {
    return (
      <div className="admin-contenu animated fadeIn">
        <LoadingAdminContenu />
      </div>
    );
  }

  return (
    <div className="admin-contenu animated fadeIn">
      <StyledHeader>
        <StyledTitle>Contenus</StyledTitle>

        <StyledSort>
          {/* <StyledStatus
          // onClick={this.reorderOnTopPubblish}
          // className={
          //   "status-pill bg-" +
          //   (this.state.published
          //     ? colorStatut("Publié")
          //     : colorStatut("Inactif"))
          // }
          >
            {"Publié"}
          </StyledStatus>
          <StyledStatus
          // onClick={this.reorderOnTopDraft}
          // className={
          //   "status-pill bg-" +
          //   (this.state.draft
          //     ? colorStatut("Brouillon")
          //     : colorStatut("Inactif"))
          // }
          >
            {"Brouillons"}
          </StyledStatus>
          <StyledStatus
          // onClick={this.reorderOnTopDeleted}
          // className={
          //   "status-pill bg-" +
          //   (this.state.deleted
          //     ? colorStatut("Supprimé")
          //     : colorStatut("Inactif"))
          // }
          >
            {"Supprimé"}
          </StyledStatus> */}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {headers.map((element, key) => (
                <th
                  key={key}
                  className={
                    (element.active ? "texte-bold" : "") +
                    (element.hideOnPhone ? " hideOnPhone" : "") +
                    " cursor-pointer"
                  }
                  onClick={() => this.reorder(key, element)}
                >
                  {element.name}
                  {element.order && (
                    <EVAIcon
                      name={"chevron-" + (element.croissant ? "up" : "down")}
                      fill={variables.noir}
                      className="sort-btn"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dispositifs
              .filter((disp) => disp.status === "Actif")
              .map((element, key) => {
                const nbDays =
                  -moment(element.updatedAt).diff(moment(), "days") + " jours";
                const burl =
                  url +
                  (element.typeContenu || "dispositif") +
                  "/" +
                  element._id;

                return (
                  <tr key={key}>
                    <td
                      className="align-middle"
                      onClick={() =>
                        (element.children || []).length > 0 &&
                        this.toggleExpanded(key)
                      }
                    >
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
                          onClick={() => this.update_status(element)}
                          disabled={
                            element.status === "Actif" ||
                            !element.mainSponsor ||
                            element.mainSponsor.status !== "Actif"
                          }
                          hoverColor={variables.validationHover}
                        />
                        <DeleteButton
                          onClick={() => this.prepareDeleteContrib(element)}
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
