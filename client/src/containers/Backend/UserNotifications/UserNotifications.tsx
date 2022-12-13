import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/legacy/image";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator
} from "services/UserStructure/userStructure.actions";
import { userStructureIdSelector } from "services/User/user.selectors";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification,
  userStructureSelector
} from "services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import styled from "styled-components";
import { formatNotifications } from "./lib";
import { Notification } from "./components/Notification";
import { ReactionLectureModal } from "components/Modals";
import { FormattedNotification } from "./types";
import Swal from "sweetalert2";
import { updateDispositifReactionActionCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import Skeleton from "react-loading-skeleton";
import { assetsOnServer } from "assets/assetsOnServer";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import { colors } from "colors";

const MainContainer = styled.div`
  background: ${colors.lightGrey};
  border-radius: 12px;
  padding: 40px;
  margin-top: 26px;
  margin-right: 120px;
  margin-left: 120px;
  height: fit-content;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  margin-bottom: 8px;
`;

const CenterContainer = styled.div`
  color: ${colors.darkGrey};
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  history: any;
  title: string;
}
const UserNotifications = (props: Props) => {
  const [selectedReaction, setSelectedReaction] = useState<FormattedNotification | null>(null);
  const [showReactionModal, setShowReactionModal] = useState(false);

  const toggleReactionModal = () => setShowReactionModal(!showReactionModal);

  const dispatch = useDispatch();
  const structureId = useSelector(userStructureIdSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE));
  const userStructure = useSelector(userStructureSelector);

  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenAnnuaireNotif = useSelector(userStructureHasResponsibleSeenNotification);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadUserStructure = async () => {
      if (structureId) {
        dispatch(fetchUserStructureActionCreator({ structureId, shouldRedirect: true }));
      }
    };
    loadUserStructure();
    window.scrollTo(0, 0);
  }, [dispatch, structureId]);

  const notifications = formatNotifications(dispositifsAssocies, hasResponsibleSeenAnnuaireNotif);

  const nbNewNotifications = notifications.filter((notif) => !notif.read).length;

  const onNotificationClick = (notif: FormattedNotification) => {
    if (notif.type === "reaction") {
      setSelectedReaction(notif);
      setShowReactionModal(true);
      return;
    }
    return;
  };

  const deleteNotificationAndUpdate = async (notif: FormattedNotification | null) => {
    if (!notif) return;
    try {
      if (!notif.dispositifId || !notif.suggestionId || !structureId) return;
      dispatch(
        updateDispositifReactionActionCreator({
          dispositif: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            fieldName: "suggestions",
            type: "remove"
          },
          structureId
        })
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a bien été supprimée",
        type: "success",
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de la suppression",
        type: "error",
        timer: 1500
      });
    }

    setShowReactionModal(false);
  };

  const readNotificationAndUpdate = async (notif: FormattedNotification | null) => {
    if (!notif) return;
    try {
      if (!notif.dispositifId || !notif.suggestionId || !structureId) return;
      dispatch(
        updateDispositifReactionActionCreator({
          dispositif: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            fieldName: "suggestions.$.read",
            type: "read"
          },
          structureId
        })
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a été marquée comme lue",
        type: "success",
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de l'enregistrement",
        type: "error",
        timer: 1500
      });
    }

    setShowReactionModal(false);
  };

  const updateStructureWithNotificationSeen = () => {
    dispatch(
      // @ts-ignore
      setUserStructureActionCreator({
        ...userStructure,
        hasResponsibleSeenNotification: true
      })
    );
    dispatch(updateUserStructureActionCreator({ modifyMembres: false }));
    Swal.fire({
      title: "Yay...",
      text: "La notification a été supprimée",
      type: "success",
      timer: 1500
    });
  };

  if (isLoading)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MainContainer>
          <TitleWithNumber
            amount={nbNewNotifications}
            textSingular={"nouvelle notification."}
            textPlural={"nouvelles notifications."}
            isLoading={true}
          />
          <Skeleton count={3} height={50} />
        </MainContainer>
      </div>
    );

  if (notifications.length === 0)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MainContainer>
          <CenterContainer>
            <Title>Aucune notification ! </Title>
            <div style={{ marginTop: "32px", marginBottom: "20px" }}>
              <Image src={assetsOnServer.middleOffice.noNotification} alt="no-notification" width={400} height={289} />
            </div>
          </CenterContainer>
        </MainContainer>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <MainContainer>
        <TitleWithNumber
          amount={nbNewNotifications}
          textSingular={"nouvelle notification."}
          textPlural={"nouvelles notifications."}
        />

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
            history={props.history}
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
    </div>
  );
};

export default UserNotifications;
