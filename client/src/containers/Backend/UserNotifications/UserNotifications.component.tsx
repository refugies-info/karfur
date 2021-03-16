import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "../../../services/UserStructure/userStructure.actions";
import { userStructureIdSelector } from "../../../services/User/user.selectors";
import {
  userStructureDisposAssocies,
  userStructureHasResponsibleSeenNotification,
  userStructureSelector,
} from "../../../services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import styled from "styled-components";
import { formatNotifications } from "./lib";
import { Notification } from "./components/Notification";
import { ReactionLectureModal } from "../../../components/Modals";
import { FormattedNotification } from "./types";
import _ from "lodash";
import Swal from "sweetalert2";
import { updateDispositifReactionActionCreator } from "../../../services/ActiveDispositifs/activeDispositifs.actions";
import Skeleton from "react-loading-skeleton";
import { assetsOnServer } from "../../../assets/assetsOnServer";

declare const window: Window;

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
  align-items: flex-end;
`;
const NumberContainer = styled.div`
  background: #212121;
  border-radius: 12px;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: #ffffff;
  padding: 8px 19px 8px 19px;
  margin: 0px 8px 0px 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  margin-bottom: 8px;
`;

const CenterContainer = styled.div`
  color: #5e5e5e;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export interface PropsBeforeInjection {
  t: any;
  history: any;
}
export const UserNotificationsComponent = () => {
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
  const userStructure = useSelector(userStructureSelector);

  const dispositifsAssocies = useSelector(userStructureDisposAssocies);
  const hasResponsibleSeenAnnuaireNotif = useSelector(
    userStructureHasResponsibleSeenNotification
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
    window.scrollTo(0, 0);
  }, [dispatch, structureId]);

  const notifications = formatNotifications(
    dispositifsAssocies,
    hasResponsibleSeenAnnuaireNotif
  );

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

  const deleteNotificationAndUpdate = async (
    notif: FormattedNotification | null
  ) => {
    if (!notif) return;
    try {
      if (!notif.dispositifId || !notif.suggestionId || !structureId) return;
      dispatch(
        updateDispositifReactionActionCreator({
          dispositif: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            fieldName: "suggestions",
            type: "remove",
          },
          structureId,
        })
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a bien été supprimée",
        type: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de la suppression",
        type: "error",
        timer: 1500,
      });
    }

    setShowReactionModal(false);
  };

  const readNotificationAndUpdate = async (
    notif: FormattedNotification | null
  ) => {
    if (!notif) return;
    try {
      if (!notif.dispositifId || !notif.suggestionId || !structureId) return;
      dispatch(
        updateDispositifReactionActionCreator({
          dispositif: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            fieldName: "suggestions.$.read",
            type: "read",
          },
          structureId,
        })
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a été marquée comme lue",
        type: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de l'enregistrement",
        type: "error",
        timer: 1500,
      });
    }

    setShowReactionModal(false);
  };

  const updateStructureWithNotificationSeen = () => {
    dispatch(
      // @ts-ignore
      setUserStructureActionCreator({
        ...userStructure,
        hasResponsibleSeenNotification: true,
      })
    );
    dispatch(updateUserStructureActionCreator());
    Swal.fire({
      title: "Yay...",
      text: "La notification a été supprimée",
      type: "success",
      timer: 1500,
    });
  };

  if (isLoading)
    return (
      <MainContainer>
        <TitleContainer>
          <Title>Vous avez</Title>
          <NumberContainer>...</NumberContainer>
          <Title>nouvelle notification.</Title>
        </TitleContainer>
        <Skeleton count={3} height={50} />
      </MainContainer>
    );

  if (nbNewNotifications === 0)
    return (
      <MainContainer>
        <CenterContainer>
          <Title>Aucune notification ! </Title>
          <div style={{ marginTop: "32px", marginBottom: "20px" }}>
            <img
              src={assetsOnServer.middleOffice.noNotification}
              alt="no-notification"
            />
          </div>
        </CenterContainer>
      </MainContainer>
    );

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
          onReactionDeleteClick={() => deleteNotificationAndUpdate(notif)}
          onAnnuaireNotifDeleteClick={updateStructureWithNotificationSeen}
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
