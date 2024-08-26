import { assetsOnServer } from "@/assets/assetsOnServer";
import TitleWithNumber from "@/components/Backend/TitleWithNumber";
import { ReactionLectureModal } from "@/components/Modals";
import { useLocale } from "@/hooks";
import { updateDispositifReactionActionCreator } from "@/services/ActiveDispositifs/activeDispositifs.actions";
import { LoadingStatusKey } from "@/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "@/services/LoadingStatus/loadingStatus.selectors";
import { fetchSelectedStructureActionCreator } from "@/services/SelectedStructure/selectedStructure.actions";
import { userStructureIdSelector } from "@/services/User/user.selectors";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "@/services/UserStructure/userStructure.actions";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification,
  userStructureSelector,
} from "@/services/UserStructure/userStructure.selectors";
import { colors } from "@/utils/colors";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Notification } from "./components/Notification";
import { formatNotifications } from "./lib";
import { FormattedNotification } from "./types";

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
  const locale = useLocale();
  const structureId = useSelector(userStructureIdSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE));
  const userStructure = useSelector(userStructureSelector);

  useEffect(() => {
    // fetch structure to navigate to structure form
    if (userStructure) {
      dispatch(
        fetchSelectedStructureActionCreator({
          id: userStructure._id.toString(),
          locale: locale,
        }),
      );
    }
  }, [userStructure, dispatch, locale]);

  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenAnnuaireNotif = useSelector(userStructureHasResponsibleSeenNotification);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadUserStructure = async () => {
      if (structureId) {
        dispatch(fetchUserStructureActionCreator({ structureId, shouldRedirect: false }));
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
          suggestion: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            type: "remove",
          },
          structureId,
        }),
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a bien été supprimée",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de la suppression",
        icon: "error",
        timer: 1500,
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
          suggestion: {
            dispositifId: notif.dispositifId,
            suggestionId: notif.suggestionId,
            type: "read",
          },
          structureId,
        }),
      );
      Swal.fire({
        title: "Yay...",
        text: "La réaction a été marquée comme lue",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oops",
        text: "Erreur lors de l'enregistrement",
        icon: "error",
        timer: 1500,
      });
    }

    setShowReactionModal(false);
  };

  const updateStructureWithNotificationSeen = () => {
    dispatch(updateUserStructureActionCreator({ structure: { hasResponsibleSeenNotification: true } }));
    Swal.fire({
      title: "Yay...",
      text: "La notification a été supprimée",
      icon: "success",
      timer: 1500,
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
