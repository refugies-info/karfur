import React from "react";
import { Badge, Progress } from "reactstrap";

import AvancementTable from "../AvancementTable";
import {
  colorAvancement,
  colorStatut,
} from "../../../Functions/ColorFunctions";
import "./AvancementLangue.css";

export default function AvancementLangue(props) {
  return (
    <AvancementTable
      headers={props.headers}
      title={props.title}
      data={props.data}
      switchView={props.switchView}
    >
      {props.data.map((element) => {
        return (
          <tr
            key={element._id}
            onClick={() => props.switchView(props.mainView, element)}
          >
            <td className="align-middle">{element.langueFr}</td>
            <td className="align-middle">
              {props.mainView ? (
                <i
                  className={
                    "flag-icon flag-icon-" + element.langueCode + " h1"
                  }
                  title={element.code}
                  id={element.code}
                ></i>
              ) : (
                element.nombreMots
              )}
            </td>
            <td className="align-middle">
              <div>
                {Math.round(element.avancement * 100)} %
                {!props.mainView &&
                  " (" +
                    Math.round(element.nombreMots * (1 - element.avancement)) +
                    " mots restants)"}
              </div>
              <Progress
                color={colorAvancement(element.avancement)}
                value={element.avancement * 100}
              />
            </td>
            <td className="align-middle">
              <Badge color={colorStatut(element.status)}>
                {element.status}
              </Badge>
            </td>
          </tr>
        );
      })}
    </AvancementTable>
  );
}
