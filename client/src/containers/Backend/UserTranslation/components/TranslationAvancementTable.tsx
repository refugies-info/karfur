import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "colors";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { TypeContenu } from "../../UserContributions/components/SubComponents";
import { Title, TabHeader } from "../../Admin/sharedComponents/SubComponents";
import { ProgressWithValue, TradStatus } from "./SubComponents";
import moment from "moment";
import "moment/locale/fr";
import Swal from "sweetalert2";
import API from "utils/API";
import FButton from "components/UI/FButton/FButton";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { useDispatch } from "react-redux";
import { sortData } from "./functions";
import styles from "scss/components/adminTable.module.scss";
import useRouterLocale from "hooks/useRouterLocale";
import { GetDispositifsWithTranslationAvancementResponse, GetUserInfoResponse, Id, Languages } from "api-types";
import { handleApiError } from "lib/handleApiErrors";

moment.locale("fr");

interface Props {
  isExpert: boolean;
  data: GetDispositifsWithTranslationAvancementResponse[];
  history: any;
  isAdmin: boolean;
  languei18nCode: string;
  setElementToTranslate: any;
  toggleCompleteProfilModal: () => void;
  user: GetUserInfoResponse | null;
}

const TableContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 32px;
`;

const headers = [
  { name: "Type", order: "type" },
  { name: "Titre", order: "titreInformatif" },
  { name: "Progression", order: "avancementTrad" },
  { name: "Mots", order: "nbMots" },
  { name: "Depuis", order: "created_at" },
  { name: "Statut", order: "tradStatus" },
  { name: "Dernière trad", order: "lastTradUpdatedAt" },
];

const headersExpert = [
  { name: "Type", order: "type" },
  { name: "Titre", order: "titreInformatif" },
  { name: "Progression", order: "avancementTrad" },
  { name: "Validation", order: "avancementExpert" },
  { name: "Mots", order: "nbMots" },
  { name: "Depuis", order: "created_at" },
  { name: "Statut", order: "tradStatus" },
  { name: "Dernière trad", order: "lastTradUpdatedAt" },
];
const defaultSortedHeader = {
  name: "none",
  sens: "none",
  order: "none",
};
export const TranslationAvancementTable = (props: Props) => {
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const routerLocale = useRouterLocale();

  /**
   * Cette fonction sert à court circuiter la navigation si le profil
   * de l'utilisateur n'est pas complet _notamment_
   * @param event
   * @param element
   */
  const goToTraduction = (event: any, element: GetDispositifsWithTranslationAvancementResponse) => {
    if (props.user && props.user.email === "") {
      props.toggleCompleteProfilModal();
      props.setElementToTranslate(element);
      event.preventDefault();
    } else {
      if (!props.languei18nCode || (!props.isExpert && element.tradStatus === "VALIDATED")) {
        event.preventDefault();
      }
    }
  };
  const reorder = (element: { name: string; order: string }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, order: element.order });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        order: element.order,
      });
    }
  };

  const dispatch = useDispatch();
  const deleteTrad = (e: any, element: GetDispositifsWithTranslationAvancementResponse) => {
    e.stopPropagation();
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression des traductions est irréversible",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, les supprimer",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.value) {
        API.deleteTrads({
          dispositifId: element._id,
          locale: props.languei18nCode as Languages,
        })
          .then(() => {
            dispatch(fetchDispositifsWithTranslationsStatusActionCreator(props.languei18nCode));
            Swal.fire({
              title: "Yay...",
              text: "Suppression effectuée",
              icon: "success",
              timer: 1500,
            });
          })
          .catch(() => {
            handleApiError({ text: "Something went wrong" });
          });
      }
    });
  };

  const sortedData = sortData(props.data, sortedHeader);
  return (
    <TableContainer>
      <Table responsive borderless className="avancement-table">
        <thead>
          <tr>
            {props.isExpert
              ? headersExpert.map((element, key) => {
                  return (
                    <th key={key} onClick={() => reorder(element)}>
                      <TabHeader
                        name={element.name}
                        order={element.order}
                        isSortedHeader={sortedHeader.name === element.name}
                        sens={sortedHeader.name === element.name ? sortedHeader.sens : "down"}
                      />
                    </th>
                  );
                })
              : headers.map((element, key) => {
                  return (
                    <th key={key} onClick={() => reorder(element)}>
                      <TabHeader
                        name={element.name}
                        order={element.order}
                        isSortedHeader={sortedHeader.name === element.name}
                        sens={sortedHeader.name === element.name ? sortedHeader.sens : "down"}
                      />
                    </th>
                  );
                })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((element, key) => {
            const nbDays = element.created_at ? -moment(element.created_at).diff(moment(), "days") + " jours" : "ND";
            return (
              <tr key={key} className={styles.line}>
                <td className={styles.first + " align-middle"}>
                  <TypeContenu type={element.type || "dispositif"} isDetailedVue={false} />
                </td>
                <td className="align-middle">
                  <div style={{ maxWidth: "350px" }}>
                    {/* TODO: redirect to new path */}
                    <Link
                      data-test-id={`test-line-${element._id}`}
                      onClick={(e) => goToTraduction(e, element)}
                      target={element.tradStatus === "VALIDATED" ? "_blank" : "_self"}
                      to={{
                        pathname:
                          element.tradStatus === "VALIDATED"
                            ? `${routerLocale}/${element.type}/${element._id}`
                            : routerLocale +
                              "/backend" +
                              (props.isExpert ? "/validation" : "/traduction") +
                              "/" +
                              (element.type || "dispositif"),
                        search:
                          element.tradStatus !== "VALIDATED"
                            ? `?language=${props.languei18nCode}&dispositif=${element._id}`
                            : "",
                      }}
                    >
                      <Title titreInformatif={element.titreInformatif} titreMarque={element.titreMarque || null} />
                    </Link>
                  </div>
                </td>

                <td className="align-middle">
                  {(!props.isExpert || element.tradStatus === "TO_TRANSLATE") && (
                    <ProgressWithValue avancementTrad={element.avancementTrad} isExpert={props.isExpert} />
                  )}
                </td>
                {props.isExpert && (
                  <td className="align-middle">
                    <ProgressWithValue avancementTrad={element.avancementValidation} isExpert={props.isExpert} />
                  </td>
                )}

                <td className="align-middle">
                  {Math.ceil((element.nbMots || 0) * (element.avancementTrad || 0)) + " / " + element.nbMots}
                </td>
                <td className="align-middle">{element.created_at ? nbDays : "Non disponible"}</td>
                <td className="align-middle">
                  <TradStatus status={element.tradStatus} />
                </td>
                <td className={props.isAdmin ? "align-middle " : styles.last + " align-middle"}>
                  {element.lastTradUpdatedAt
                    ? moment(element.lastTradUpdatedAt).format("DD/MM/YY H:mm")
                    : "Non disponible"}
                </td>
                {props.isAdmin && (
                  <td className={styles.last + " align-middle"}>
                    <FButton
                      type="error"
                      name="trash-2"
                      onClick={(event: any) => deleteTrad(event, element)}
                      data-test-id="test-trash"
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};
