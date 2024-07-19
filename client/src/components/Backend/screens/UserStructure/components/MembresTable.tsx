import marioProfile from "assets/mario-profile.jpg";
import { colors } from "colors";
import Image from "next/image";
import { Table } from "reactstrap";
import styled from "styled-components";
import { DeleteButton, EditButtonWithoutNavigation } from "../../Admin/sharedComponents/SubComponents";
// import "./MembresTable.scss";
import { GetStructureResponse, Id, StructureMember } from "@refugies-info/api-types";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.div<{ isUser: boolean }>`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props: { isUser: boolean }) => (props.isUser ? colors.bleuCharte : colors.gray90)};
`;

const RoleContainer = styled.div<{ isUser: boolean }>`
  background: ${colors.white};
  border-radius: 8px;
  padding: 8px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props: { isUser: boolean }) => (props.isUser ? colors.bleuCharte : colors.gray90)};
  width: fit-content;
`;

const DateContainer = styled.div<{ isUser: boolean }>`
  color: ${(props: { isUser: boolean }) => (props.isUser ? colors.bleuCharte : colors.gray90)};
  max-width: 190px;
`;
interface Props {
  membres: GetStructureResponse["membres"];
  userId: Id | null;
  isUserAuthorizedToAddMembers: boolean;
  toggleEditMemberModal: () => void;
  setSelectedUser: (user: null | StructureMember) => void;
  deleteUserFromStructure: (arg: Id) => void;
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
        const secureUrl = element?.picture?.secure_url || marioProfile;

        const isUser = !!(props.userId && props.userId.toString() === element.userId);
        return (
          <tr key={key} className="membres-table">
            <td className="align-middle">
              <RowContainer>
                <Image
                  className="user-img me-2"
                  src={secureUrl}
                  alt=""
                  width={70}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
                <UserName isUser={isUser}>{element.username || element.email || ""}</UserName>
              </RowContainer>
            </td>
            <td className="align-middle">
              <RoleContainer isUser={isUser}>{element.mainRole}</RoleContainer>
            </td>

            <td className="align-middle">
              <DateContainer isUser={isUser}>
                {element.last_connected
                  ? moment(element.last_connected).calendar() + " " + moment(element.last_connected).fromNow()
                  : "Non disponible"}
              </DateContainer>
            </td>

            <td className="align-middle">
              <DateContainer isUser={isUser}>
                {element.added_at ? moment(element.added_at).calendar() : "Non disponible"}
              </DateContainer>
            </td>

            {props.isUserAuthorizedToAddMembers && (
              <td className="align-middle">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <EditButtonWithoutNavigation
                    testId={"edit-member-" + element.userId}
                    onClick={() => {
                      props.setSelectedUser(element);
                      props.toggleEditMemberModal();
                    }}
                  />
                  <DeleteButton
                    testId={`delete-button-${element.userId}`}
                    disabled={false}
                    onClick={() => props.deleteUserFromStructure(element.userId)}
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
