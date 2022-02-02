import React, { useState } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Table } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { markerInfo } from "data/markerInfo";
import styles from "./MapParagraphe.module.scss";
import { Tag } from "types/interface";

interface Props {
  subitem: any
  updateUIArray: any
  mainTag: Tag
}

const MapParagraphePrint = (props: Props) => {
  const { t } = useTranslation();

    return (
      <div
        id="map-paragraphe"
        className={styles.map + " page-break"}
        onMouseEnter={() => props.updateUIArray(-5)}
      >
        <div
          className={styles.header}
          style={{
            backgroundColor: (props.mainTag && props.mainTag.darkColor)
              ? props.mainTag.darkColor
              : "#000000"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
            }}
          >
            <div style={{ marginLeft: 30, marginBottom: 10 }}>
              <EVAIcon name="pin-outline" className="mr-10" />
              <b>
                {t(
                  "Dispositif.Trouver un interlocuteur",
                  "Trouver un interlocuteur"
                )}{" "}
                :{" "}
              </b>
            </div>
            <Table responsive className="avancement-user-table">
              <thead>
                <tr>
                  {markerInfo.map((element, key) => (
                    <th key={key}>{element.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.subitem.markers.map((element: any, key: number) => {
                  return (
                    <tr key={key}>
                      <td className="align-middle">{element.name}</td>
                      <td className="align-middle negative-margin">
                        {element.adresse}
                      </td>
                      <td className="align-middle fit-content">
                        {element.ville}
                      </td>
                      <td className="align-middle fit-content">
                        {element.description === "" ? "Non renseigné" : element.description }
                      </td>
                      <td className="align-middle">
                        {!element.email ||
                        element.email === "ajouter@votreemail.fr" ||
                        element.email === "Non renseigné" ||
                        element.email === ""
                          ? "Non renseigné"
                          : element.email}
                      </td>
                      <td className="align-middle ">
                        {!element.telephone ||
                        element.telephone === "00 11 22 33 44" ||
                        element.telephone === "Non renseigné" ||
                        element.telephone === ""
                          ? "Non renseigné"
                          : element.telephone}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
}

export default MapParagraphePrint;
