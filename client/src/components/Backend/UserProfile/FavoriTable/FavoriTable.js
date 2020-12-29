import React from "react";
import { Col, Row, Table } from "reactstrap";
import Icon from "react-eva-icons";
import { NavLink } from "react-router-dom";
import moment from "moment/min/moment-with-locales";
import { withTranslation } from "react-i18next";

import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import { fakeFavori } from "../../../../containers/Backend/UserProfile/data";

import {colors} from "colors";

moment.locale("fr");

const favoriTable = (props) => {
  const { t } = props;
  const hasFavori = (props.dataArray || []).length > 0;
  const dataArray = hasFavori ? props.dataArray : new Array(5).fill(fakeFavori);
  let data = props.limit ? dataArray.slice(0, props.limit) : dataArray;

  const goToDispositif = (dispositif) =>
    props.history.push("/dispositif/" + dispositif._id);
  const searchTag = (tag) =>
    props.history.push({ pathname: "/advanced-search", search: "?tag=" + tag });

  let table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element, key) => (
            <th key={key}>
              {element && typeof element === "string"
                ? t("Tables." + element, element)
                : element}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, props.limit).map((element, key) => {
          const titre =
            (element.titreMarque || "") +
            (element.titreMarque && element.titreInformatif ? " - " : "") +
            (element.titreInformatif || "");
          return (
            <tr key={key}>
              <td className="align-middle">
                <EVAIcon
                  name="bookmark"
                  fill={colors.noir}
                  id="bookmarkBtn"
                />
              </td>
              <td
                className="align-middle pointer"
                onClick={() => goToDispositif(element)}
              >
                {titre}
              </td>
              <td className="align-middle negative-margin">
                {(element.tags || []).map((tag, key) => {
                  return (
                    tag && (
                      <FButton
                        key={key}
                        className={
                          "tag-btn mt-10 bg-" +
                          (tag.short || "").replace(/ /g, "-")
                        }
                        onClick={() => searchTag(tag.short)}
                      >
                        {tag.short && t("Tags." + tag.short, tag.short)}
                      </FButton>
                    )
                  );
                })}
              </td>
              <td className="align-middle">
                {element.datePin ? moment(element.datePin).fromNow() : ""}
              </td>
              <td
                className="align-middle fit-content"
                onClick={() => props.removeBookmark(element._id)}
              >
                <FButton
                  type="light-action"
                  name="trash-2-outline"
                  fill={colors.noir}
                />
              </td>
              <td className="align-middle fit-content">
                <NavLink
                  to={
                    "/" +
                    (element.typeContenu || "dispositif") +
                    "/" +
                    element._id
                  }
                  className="no-decoration"
                >
                  <FButton
                    type="light-action"
                    name="eye-outline"
                    fill={colors.noir}
                  />
                </NavLink>
              </td>
            </tr>
          );
        })}
        {props.limit && dataArray.length > 5 && (
          <tr>
            <td
              colSpan="6"
              className="align-middle voir-plus"
              onClick={() => props.toggleModal("favori")}
            >
              <Icon name="expand-outline" fill={colors.noir} size="large" />
              &nbsp;
              {t("Tables.Voir plus", "Voir plus")}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  if (props.limit) {
    return (
      <div className="tableau-wrapper" id="mes-favoris">
        <Row>
          <Col>
            <h1>{t("Tables." + props.title, props.title)}</h1>
          </Col>
        </Row>

        <div className="tableau">
          {table}

          {!hasFavori && (
            <div className="ecran-protection no-fav">
              <div className="content-wrapper">
                <h1>
                  {t(
                    "Tables.Retrouvez ici vos pages favorites",
                    "Retrouvez ici vos pages favorites"
                  )}
                </h1>
                <div className="sous-contenu">
                  {t(
                    "Tables.cherche btn",
                    "Cherchez ce bouton dans les contenus pour les sauvegarder"
                  )}{" "}
                  :
                  <EVAIcon
                    name="bookmark"
                    fill={colors.noir}
                    className="bookmark-icon"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return table;
};

export default withTranslation()(favoriTable);
