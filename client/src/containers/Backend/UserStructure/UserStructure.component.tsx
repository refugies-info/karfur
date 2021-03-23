/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStructureActionCreator } from "../../../services/UserStructure/userStructure.actions";
import {
  userStructureSelector,
  userStructureMembresSelector,
} from "../../../services/UserStructure/userStructure.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { UserStructureLoading } from "./components/UserStructureLoading";
import {
  MainContainer,
  StructurePictureContainer,
  StructureContainer,
} from "./components/SubComponents";
import { TitleWithNumber } from "../middleOfficeSharedComponents";
import { UserStructureDetails } from "./components/UserStructureDetails";
import styled from "styled-components";
import { colors } from "../../../colors";
import { userSelector } from "../../../services/User/user.selectors";

const ErrorContainer = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
`;

const ErrorText = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${colors.error};
  margin-top: 60px;
`;

declare const window: Window;

export const UserStructureComponent = () => {
  const dispatch = useDispatch();
  const userStructure = useSelector(userStructureSelector);
  const user = useSelector(userSelector);
  useEffect(() => {
    if (userStructure) {
      dispatch(
        fetchUserStructureActionCreator({
          structureId: userStructure._id,
          shouldRedirect: true,
        })
      );
    }
    window.scrollTo(0, 0);
  }, []);

  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  );
  const isLoadingUpdate = useSelector(
    isLoadingSelector(LoadingStatusKey.UPDATE_USER_STRUCTURE)
  );

  const isLoading = isLoadingFetch || isLoadingUpdate;

  const membres = useSelector(userStructureMembresSelector);
  if (isLoading) {
    return <UserStructureLoading />;
  }

  if (!userStructure) return <div>No structure</div>;

  if (userStructure.status === "En attente")
    return (
      <ErrorContainer>
        <ErrorText>
          Votre structure n'a pas été validée. Veuillez contacter l'équipe de
          réfugiés.info via le live chat en bas à droite de votre écran.
        </ErrorText>
      </ErrorContainer>
    );

  return (
    <UserStructureDetails
      picture={userStructure.picture}
      name={userStructure.nom}
      acronyme={userStructure.acronyme}
      membres={membres}
      // @ts-ignore
      userId={user.userId}
    />
  );
};
