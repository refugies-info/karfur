import { Table } from "reactstrap";
import React from "react";
import Image from "next/image";
import { UserStructureMembre } from "../../../../types/interface";
import {
  EditButtonWithoutNavigation,
  DeleteButton,
} from "../../Admin/sharedComponents/SubComponents";
import marioProfile from "assets/mario-profile.jpg";
import styled from "styled-components";
import { colors } from "../../../../colors";
// import "./MembresTable.scss";
import { ObjectId } from "mongodb";
import moment from "moment/min/moment-with-locales";

moment.locale("fr");
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => (props.isUser ? colors.bleuCharte : colors.noir)};
`;

const RoleContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 8px;
  padding: 8px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => (props.isUser ? colors.bleuCharte : colors.noir)};
  width: fit-content;
`;

const DateContainer = styled.div`
  color: ${(props) => (props.isUser ? colors.bleuCharte : colors.noir)};
  max-width: 190px;
`;
interface Props {
  membres: UserStructureMembre[];
  userId: ObjectId;
  isUserAuthorizedToAddMembers: boolean;
  toggleEditMemberModal: () => void;
  setSelectedUser: (user: null | UserStructureMembre) => void;
  deleteUserFromStructure: (arg: ObjectId) => void;
}

const headers = ["Nom", "Role", "Dernière connexion", "Ajouté le"];

export const MembresTable = (props: Props) => (
  <Table responsive borderless>
    <thead>
      <tr>
        {headers.map((element, key) => {
          return <th key={key}>{element}</th>;
        })}
      </tr>
    </thead>
    <tbody>
      {props.membres.map((element, key) => {
        const secureUrl =
          element && element.picture && element.picture.secure_url
            ? element.picture.secure_url
            : marioProfile;

        const isUser = props.userId.toString() === element._id.toString();
        return (
          <tr key={key} className="membres-table">
            <td className="align-middle">
              <RowContainer>
                <Image
                  className="user-img mr-8"
                  src={secureUrl}
                  alt=""
                  width={70}
                  height={40}
                  objectFit="contain"
                />
                <UserName isUser={isUser}>{element.username}</UserName>
              </RowContainer>
            </td>
            <td className="align-middle">
              <RoleContainer isUser={isUser}>{element.mainRole}</RoleContainer>
            </td>

            <td className="align-middle">
              <DateContainer isUser={isUser}>
                {element.last_connected
                  ? moment(element.last_connected).calendar() +
                    " " +
                    moment(element.last_connected).fromNow()
                  : "Non disponible"}
              </DateContainer>
            </td>

            <td className="align-middle">
              <DateContainer isUser={isUser}>
                {element.added_at
                  ? moment(element.added_at).calendar()
                  : "Non disponible"}
              </DateContainer>
            </td>

            {props.isUserAuthorizedToAddMembers && (
              <td className="align-middle">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <EditButtonWithoutNavigation
                    // @ts-ignore
                    testID={"test_see_" + element._id}
                    onClick={() => {
                      props.setSelectedUser(element);
                      props.toggleEditMemberModal();
                    }}
                  />
                  <DeleteButton
                    testID={"test_delete_" + element._id}
                    disabled={false}
                    onClick={() => props.deleteUserFromStructure(element._id)}
                  />
                </div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  </Table>
);
