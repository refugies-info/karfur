/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
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
import { formatNotifications } from "./lib";

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
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

  const notifications = formatNotifications(
    dispositifsAssocies,
    hasResponsibleSeenAnnuaireNotif
  );
  const nbNotifications = notifications.length;

  console.log("notifications", notifications);

  if (isLoading) return <Spinner />;

  return (
    <MainContainer>
      <RowContainer>
        <Title>Vous avez</Title>
        <NumberContainer>{nbNotifications}</NumberContainer>
        <Title>{nbNotifications < 3 ? "notification" : "notifications"}</Title>
      </RowContainer>
    </MainContainer>
  );
};
