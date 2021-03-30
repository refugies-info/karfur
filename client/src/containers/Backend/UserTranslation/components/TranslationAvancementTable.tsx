import React from "react";
import { IDispositifTranslation } from "../../../../types/interface";
import styled from "styled-components";
import { colors } from "../../../../colors";
import { Table } from "reactstrap";
import { TypeContenu } from "../../UserContributions/components/SubComponents";
import { Title } from "../../Admin/sharedComponents/SubComponents";
import { ProgressWithValue, TradStatus } from "./SubComponents";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import API from "../../../../utils/API";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "../../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { useDispatch } from "react-redux";

moment.locale("fr");

interface Props {
  isExpert: boolean;
  data: IDispositifTranslation[];
  history: any;
  langueId: string;
  isAdmin: boolean;
  languei18nCode: string;
}

const TableContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 12px;
  padding: 32px;
`;

const headers = [
  "Type",
  "Titre",
  "Progression",
  "Mots",
  "Depuis",
  "Statut",
  "Dernière trad",
];

const headersExpert = [
  "Type",
  "Titre",
  "Progression",
  "Validation",
  "Mots",
  "Depuis",
  "Statut",
  "Dernière trad",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const TranslationAvancementTable = (props: Props) => {
  const goToTraduction = (element: IDispositifTranslation) => {
    if (!props.isExpert && element.tradStatus === "Validée") return;
    return props.history.push({
      pathname:
        (props.isExpert ? "/validation" : "/traduction") +
        "/" +
        (element.typeContenu || "dispositif") +
        "/" +
        element._id,
      search: "?id=" + props.langueId,
    });
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
  return (
    <TableContainer>
      <Table responsive borderless className="avancement-table">
        <thead>
          <tr className="tr-test">
            {props.isExpert
              ? headersExpert.map((element, key) => {
                  return <th key={key}>{element}</th>;
                })
              : headers.map((element, key) => {
                  return <th key={key}>{element}</th>;
                })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((element, key) => {
            const nbDays = element.created_at
              ? -moment(element.created_at).diff(moment(), "days") + " jours"
              : "ND";
            return (
              <tr key={key} onClick={() => goToTraduction(element)}>
                <td className="align-middle">
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
                <td className="align-middle">
                  {element.lastTradUpdatedAt
                    ? moment(element.lastTradUpdatedAt).format("L")
                    : "Non disponible"}
                </td>
                {props.isAdmin && (
                  <td className="align-middle">
                    <FButton
                      type="error"
                      name="trash-2"
                      onClick={(event: any) => deleteTrad(event, element)}
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
