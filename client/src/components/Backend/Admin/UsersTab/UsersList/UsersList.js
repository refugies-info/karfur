import React from "react";
import { Badge, Card, CardBody, CardHeader, Table, Col, Row } from "reactstrap";

import marioProfile from "../../../../../assets/mario-profile.jpg";
import { colorStatut } from "../../../../Functions/ColorFunctions";
import EVAIcon from "../../../../UI/EVAIcon/EVAIcon";

import "./UsersList.scss";
import { colors } from "colors";

const usersList = (props) => {
  const getRoleName = (role) => {
    let eqRole = props.roles.find((x) => x._id === role);
    return eqRole ? eqRole.nomPublique : "";
  };
  return (
    <Card className="users-list">
      <CardHeader className="h1">
        <strong>Utilisateurs</strong>
      </CardHeader>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">
                Photo
                <EVAIcon
                  onClick={() => props.reorder("users", "picture.imgId")}
                  name="chevron-down"
                  fill={colors.noir}
                  className="sort-btn"
                />
              </th>
              <th scope="col">
                Nom
                <EVAIcon
                  onClick={() => props.reorder("users", "username")}
                  name="chevron-down"
                  fill={colors.noir}
                  className="sort-btn"
                />
              </th>
              <th scope="col">
                Langues
                <EVAIcon
                  onClick={() =>
                    props.reorder("users", "selectedLanguages.0.langueFr")
                  }
                  name="chevron-down"
                  fill={colors.noir}
                  className="sort-btn"
                />
              </th>
              <th scope="col">
                Rôles
                <EVAIcon
                  onClick={() => props.reorder("users", "roles.0")}
                  name="chevron-down"
                  fill={colors.noir}
                  className="sort-btn"
                />
              </th>
              <th scope="col">
                Statut
                <EVAIcon
                  onClick={() => props.reorder("users", "status")}
                  name="chevron-down"
                  fill={colors.noir}
                  className="sort-btn"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {props.users.map((user) => (
              <tr
                key={user._id.toString()}
                onClick={() => props.onSelect({ user: user })}
              >
                <th scope="row">
                  <img
                    className="img-circle small-picture"
                    src={user.picture ? user.picture.secure_url : marioProfile}
                    alt="profile"
                  />
                </th>
                <td>{user.username}</td>
                <td>
                  {user.selectedLanguages.map((langue) => (
                    <Row key={langue._id}>{langue.langueFr}</Row>
                  ))}
                </td>
                <td>
                  {user.roles.map((role) => (
                    <Col key={role}>{getRoleName(role)}</Col>
                  ))}
                </td>
                <td>
                  <Badge color={colorStatut(user.status)}>{user.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default usersList;
