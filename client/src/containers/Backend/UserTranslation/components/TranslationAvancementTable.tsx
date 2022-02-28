import React, { useState } from "react";
import { IDispositifTranslation } from "types/interface";
import styled from "styled-components";
import { colors } from "colors";
import { Table } from "reactstrap";
import { TypeContenu } from "../../UserContributions/components/SubComponents";
import { Title, TabHeader } from "../../Admin/sharedComponents/SubComponents";
import { ProgressWithValue, TradStatus } from "./SubComponents";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import API from "utils/API";
import FButton from "components/FigmaUI/FButton/FButton";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { useDispatch } from "react-redux";
import { ObjectId } from "mongodb";
import { sortData } from "./functions";
import { User } from "types/interface";
import styles from "scss/components/adminTable.module.scss";

moment.locale("fr");

interface Props {
  isExpert: boolean;
  data: IDispositifTranslation[];
  history: any;
  langueId: ObjectId | null;
  isAdmin: boolean;
  languei18nCode: string;
  setElementToTranslate: any;
  toggleCompleteProfilModal: () => void;
  user: User | null;
}

const TableContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 32px;
`;

const headers = [
  { name: "Type", order: "typeContenu" },
  { name: "Titre", order: "titreInformatif" },
  { name: "Progression", order: "avancementTrad" },
  { name: "Mots", order: "nbMots" },
  { name: "Depuis", order: "created_at" },
  { name: "Statut", order: "tradStatus" },
  { name: "Dernière trad", order: "lastTradUpdatedAt" },
];

const headersExpert = [
  { name: "Type", order: "typeContenu" },
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

  const goToTraduction = (element: IDispositifTranslation) => {
    if (props.user && props.user.email === "") {
      props.toggleCompleteProfilModal();
      props.setElementToTranslate(element);
    } else {
      if (!props.langueId) return;
      if (!props.isExpert && element.tradStatus === "Validée") return;
      return props.history.push({
        pathname:
          "/backend" +
          (props.isExpert ? "/validation" : "/traduction") +
          "/" +
          (element.typeContenu || "dispositif"),
        search: `?language=${props.langueId}&dispositif=${element._id}`
      });
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
  const deleteTrad = (e: any, element: IDispositifTranslation) => {
    e.stopPropagation();
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "La suppression des traductions est irréversible",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, les supprimer",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.value) {
        API.delete_trads({
          articleId: element._id,
          langueCible: props.languei18nCode,
        })
          .then(() => {
            dispatch(
              fetchDispositifsWithTranslationsStatusActionCreator(
                props.languei18nCode
              )
            );
            Swal.fire({
              title: "Yay...",
              text: "Suppression effectuée",
              type: "success",
              timer: 1500,
            });
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
                        sens={
                          sortedHeader.name === element.name
                            ? sortedHeader.sens
                            : "down"
                        }
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
                        sens={
                          sortedHeader.name === element.name
                            ? sortedHeader.sens
                            : "down"
                        }
                      />
                    </th>
                  );
                })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((element, key) => {
            const nbDays = element.created_at
              ? -moment(element.created_at).diff(moment(), "days") + " jours"
              : "ND";
            return (
              <tr
                key={key}
                onClick={() => goToTraduction(element)}
                className={styles.line}
                // @ts-ignore
                testID={`test-line-${element._id}`}
              >
                <td className={styles.first + " align-middle"}>
                  <TypeContenu
                    type={element.typeContenu || "dispositif"}
                    isDetailedVue={false}
                  />
                </td>
                <td className="align-middle">
                  <div style={{ maxWidth: "350px" }}>
                    <Title
                      titreInformatif={element.titreInformatif}
                      titreMarque={element.titreMarque || null}
                    />
                  </div>
                </td>

                <td className="align-middle">
                  {(!props.isExpert || element.tradStatus === "À traduire") && (
                    <ProgressWithValue
                      avancementTrad={element.avancementTrad}
                      isExpert={props.isExpert}
                    />
                  )}
                </td>
                {props.isExpert && (
                  <td className="align-middle">
                    <ProgressWithValue
                      avancementTrad={element.avancementExpert}
                      isExpert={props.isExpert}
                    />
                  </td>
                )}

                <td className="align-middle">
                  {Math.round(
                    (element.nbMots || 0) * (element.avancementTrad || 0)
                  ) +
                    " / " +
                    element.nbMots}
                </td>
                <td className="align-middle">
                  {element.created_at ? nbDays : "Non disponible"}
                </td>
                <td className="align-middle">
                  <TradStatus status={element.tradStatus} />
                </td>
                <td
                  className={
                    props.isAdmin ? "align-middle " : styles.last + " align-middle"
                  }
                >
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
                      testID="test-trash"
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
