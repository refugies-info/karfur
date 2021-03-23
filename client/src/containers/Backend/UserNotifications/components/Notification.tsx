import React from "react";
import styled from "styled-components";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import moment, { Moment } from "moment";
import FButton from "../../../../components/FigmaUI/FButton/FButton";

const Container = styled.div`
  background: ${(props) => (props.read ? "#FFFFFF" : "#2D9CDB")};
  border-radius: 12px;
  padding: 8px 8px 8px 20px;
  margin: 8px 0px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => (props.read ? "#FFFFFF" : "#2D9CDB")};

  &:hover {
    border-color: #212121;
  }
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TextContainer = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  color: ${(props) => (props.read ? "#212121" : "#FFFFFF")};
  margin-left: 20px;
`;

const DispositifTitle = styled.div`
  background: #edebeb;
  border-radius: 8px;
  padding: 8px;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-left: 8px;
`;

const DateContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => (props.read ? "#f44336" : "#FFFFFF")};
  margin-right: 8px;
  margin-left: 8px;
`;

interface Props {
  read: boolean;
  type: "reaction" | "annuaire" | "new content";
  title: string | undefined;
  createdAt: Moment | undefined;
  link: string | undefined;
  onClick: () => void;
  onReactionDeleteClick: () => void;
  onAnnuaireNotifDeleteClick: () => void;
  history: any;
}
const getText = (type: "reaction" | "annuaire" | "new content") => {
  if (type === "reaction") return "Nouvelle réaction sur la fiche :";

  if (type === "annuaire")
    return "Recensez votre structure dans l'annuaire de l'intégration";

  return "Un nouveau contenu a été attribué à votre structure !";
};

const getFormattedDate = (createdAt: Moment) => {
  const nbDays = -moment(createdAt).diff(moment(), "days");
  if (nbDays === 0) return "Aujourd'hui";
  if (nbDays === 1) return "Hier";

  return "Depuis " + nbDays + " jours";
};
export const Notification = (props: Props) => {
  const onNotifClick = (event: any) => {
    event.stopPropagation();
    if (props.type === "reaction") {
      props.onClick();
      return;
    }

    if (props.type === "annuaire") {
      return props.history.push("/annuaire-create");
    }

    if (props.type === "new content") {
      return props.history.push(props.link);
    }
  };

  const onReactionDeleteClick = (event: any) => {
    event.stopPropagation();
    props.onReactionDeleteClick();
  };

  const onAnnuaireNotifDeleteClick = (event: any) => {
    event.stopPropagation();
    props.onAnnuaireNotifDeleteClick();
  };

  return (
    <Container read={props.read} onClick={(event: any) => onNotifClick(event)}>
      <RowContainer>
        <EVAIcon
          name={props.read ? "bell-outline" : "bell"}
          fill={props.read ? "#212121" : "#FFFFFF"}
        />
        <TextContainer read={props.read}>{getText(props.type)}</TextContainer>
        {props.type === "reaction" && props.title && (
          <DispositifTitle>{props.title}</DispositifTitle>
        )}
      </RowContainer>
      <RowContainer>
        {props.createdAt && (
          <DateContainer read={props.read}>
            {getFormattedDate(props.createdAt)}
          </DateContainer>
        )}
        {props.type === "annuaire" && (
          <>
            <FButton type="dark" className="mr-8" name="folder-add-outline">
              Compléter la fiche annuaire
            </FButton>
            <FButton
              type="error"
              name="trash-2"
              onClick={onAnnuaireNotifDeleteClick}
              className="ml-8"
            />
          </>
        )}
        {props.type === "new content" && props.link && (
          <FButton type="dark" name="eye">
            Voir la fiche
          </FButton>
        )}
        {props.type === "reaction" && (
          <>
            <FButton type="dark" name="eye">
              Voir la réaction
            </FButton>
            <FButton
              type="error"
              name="trash-2"
              onClick={onReactionDeleteClick}
              className="ml-8"
            />
          </>
        )}
      </RowContainer>
    </Container>
  );
};
