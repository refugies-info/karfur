/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { Props } from "./UserNotifications.container";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStructureActionCreator } from "../../../services/UserStructure/userStructure.actions";
import { userStructureIdSelector } from "../../../services/User/user.selectors";
import {
  userStructureDisposAssocies,
  userStructureHasResponsibleSeenNotification,
} from "../../../services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { Spinner } from "reactstrap";
import styled from "styled-components";
import {
  formatNotifications,
  deleteNotification,
  readNotification,
} from "./lib";
import { Notification } from "./components/Notification";
import { ReactionLectureModal } from "../../../components/Modals";
import { FormattedNotification } from "./types";
import API from "../../../utils/API";
import _ from "lodash";

const MainContainer = styled.div`
  background: #edebeb;
  border-radius: 12px;
  padding: 40px;
  margin-top: 26px;
  margin-right: 120px;
  margin-left: 120px;
  width: 100%;
  height: fit-content;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
`;
const NumberContainer = styled.div`
  background: #212121;
  border-radius: 12px;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: #ffffff;
  padding: 4px 12px 4px 12px;
  margin: 0px 8px 0px 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
`;

export interface PropsBeforeInjection {
  t: any;
  history: any;
}
export const UserNotificationsComponent = (props: Props) => {
  const [
    selectedReaction,
    setSelectedReaction,
  ] = useState<FormattedNotification | null>(null);
  const [showReactionModal, setShowReactionModal] = useState(false);

  const toggleReactionModal = () => setShowReactionModal(!showReactionModal);

  const dispatch = useDispatch();
  const structureId = useSelector(userStructureIdSelector);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  );

  const dispositifsAssocies = useSelector(userStructureDisposAssocies);
  console.log("dispositifsAssocies", dispositifsAssocies);
  const hasResponsibleSeenAnnuaireNotif = useSelector(
    userStructureHasResponsibleSeenNotification
  );
  console.log(
    "hasResponsibleSeenAnnuaireNotif",
    hasResponsibleSeenAnnuaireNotif
  );
  useEffect(() => {
    const loadUserStructure = async () => {
      if (structureId) {
        await dispatch(
          fetchUserStructureActionCreator({ structureId, shouldRedirect: true })
        );
      }
    };
    loadUserStructure();
  }, [dispatch, structureId]);
  console.log("dispos", dispositifsAssocies);
  const notifications = formatNotifications(
    dispositifsAssocies,
    hasResponsibleSeenAnnuaireNotif
  );

  console.log("notifications", notifications);
  const nbNewNotifications = notifications.filter((notif) => !notif.read)
    .length;

  const onNotificationClick = (notif: FormattedNotification) => {
    if (notif.type === "reaction") {
      setSelectedReaction(notif);
      setShowReactionModal(true);
      return;
    }
    return;
  };

  const deleteNotificationAndUpdate = (notif: FormattedNotification | null) => {
    if (!notif) return;
    deleteNotification(notif);
    dispatch(
      fetchUserStructureActionCreator({ structureId, shouldRedirect: true })
    );
    setShowReactionModal(false);
  };

  const readNotificationAndUpdate = (notif: FormattedNotification | null) => {
    if (!notif) return;
    readNotification(notif);
    dispatch(
      fetchUserStructureActionCreator({ structureId, shouldRedirect: true })
    );
    setShowReactionModal(false);
  };
  console.log("notifications", notifications);

  if (isLoading) return <Spinner />;

  return (
    <MainContainer>
      <TitleContainer>
        <Title>Vous avez</Title>
        <NumberContainer>{nbNewNotifications}</NumberContainer>
        <Title>
          {nbNewNotifications < 2
            ? "nouvelle notification."
            : "nouvelles notifications."}
        </Title>
      </TitleContainer>
      {notifications.map((notif) => (
        <Notification
          type={notif.type}
          read={notif.read}
          key={notif.suggestionId || notif.type}
          title={notif.title}
          createdAt={notif.createdAt}
          link={notif.link}
          onClick={() => onNotificationClick(notif)}
        />
      ))}
      <ReactionLectureModal
        suggestion={selectedReaction}
        show={showReactionModal}
        toggle={toggleReactionModal}
        delete={() => deleteNotificationAndUpdate(selectedReaction)}
        read={() => readNotificationAndUpdate(selectedReaction)}
      />
    </MainContainer>
  );
};
