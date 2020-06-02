import React from "react";
import { Badge, Card, CardBody, CardHeader, Table } from "reactstrap";

import { colorStatut } from "../../../../Functions/ColorFunctions";
import "./ThemesList.scss";

const maxDescriptionLength = 40;
const themesList = (props) => {
  const theme_under = (theme) => {
    if (theme.themeUnderId && theme.themeUnderId !== "undefined") {
      return props.themes.find((item) => item._id === theme.themeUnderId)
        .themeNom;
    } else if (theme.themeIsUnder) {
      return "A définir !";
    } 
      return "Aucune";
    
  };
  return (
    <Card className="themes-list">
      <CardHeader className="h1">
        <strong>Thèmes disponibles</strong>
      </CardHeader>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Description</th>
              <th scope="col">Thème principal</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            {props.themes.map((theme) => (
              <tr
                key={theme._id.toString()}
                onClick={() => props.onSelect({ theme: theme })}
              >
                <th scope="row">{theme.themeNom}</th>
                <td>
                  {theme.themeDescription.substring(
                    0,
                    Math.min(
                      theme.themeDescription.length,
                      maxDescriptionLength
                    )
                  ) +
                    (theme.themeDescription.length > maxDescriptionLength
                      ? "..."
                      : "")}
                </td>
                <td>{theme_under(theme)}</td>
                <td>
                  <Badge color={colorStatut(theme.status)}>
                    {theme.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default themesList;
