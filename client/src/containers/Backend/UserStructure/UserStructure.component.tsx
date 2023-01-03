import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator
} from "services/UserStructure/userStructure.actions";
import { userStructureSelector, userStructureMembresSelector } from "services/UserStructure/userStructure.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { UserStructureLoading } from "./components/UserStructureLoading";

import { UserStructureDetails } from "./components/UserStructureDetails";
import styled from "styled-components";
import { colors } from "colors";
import { userSelector } from "services/User/user.selectors";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";

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

interface Props {
  title: string;
}

export const UserStructureComponent = (props: Props) => {
  const dispatch = useDispatch();
  const userStructure = useSelector(userStructureSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userStructure) {
      dispatch(
        fetchUserStructureActionCreator({
          structureId: userStructure._id,
          shouldRedirect: true
        })
      );
    }
    window.scrollTo(0, 0);
  }, [dispatch]);

  const isLoadingFetch = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE));
  const isLoadingUpdate = useSelector(isLoadingSelector(LoadingStatusKey.UPDATE_USER_STRUCTURE));

  const isLoading = isLoadingFetch || isLoadingUpdate;

  const membres = useSelector(userStructureMembresSelector);

  const addUserInStructure = (userId: ObjectId) => {
    if (!userStructure) return;
    dispatch(
      updateUserStructureActionCreator({
        modifyMembres: true,
        data: { structureId: userStructure._id, userId, type: "create" }
      })
    );
  };

  const modifyRole = (userId: ObjectId, role: "contributeur" | "administrateur") => {
    if (!userStructure) return;

    dispatch(
      updateUserStructureActionCreator({
        modifyMembres: true,
        data: {
          structureId: userStructure._id,
          userId,
          newRole: role,
          type: "modify"
        }
      })
    );
  };

  const deleteUserFromStructure = (userId: ObjectId) => {
    if (!userStructure) return;

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous êtes sur le point d'enlever un membre de votre structure.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, l'enlever",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.value) {
        dispatch(
          updateUserStructureActionCreator({
            modifyMembres: true,
            data: {
              structureId: userStructure._id,
              userId,
              type: "delete"
            }
          })
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <UserStructureLoading />
      </div>
    );
  }

  if (!userStructure)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <ErrorContainer>
          <ErrorText>
            Une erreur est survenue. Veuillez recharger la page ou contacter l'équipe de réfugiés.info via le live chat
            en bas à droite de votre écran.
          </ErrorText>
        </ErrorContainer>
      </div>
    );

  const membresToDisplay = membres.sort((a, b) => {
    if (a._id === user.userId) return -1;
    if (b._id === user.userId) return 1;
    return -1;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <UserStructureDetails
        picture={userStructure.picture}
        name={userStructure.nom}
        acronyme={userStructure.acronyme}
        membres={membresToDisplay}
        // @ts-ignore
        userId={user.userId}
        structureId={userStructure._id}
        addUserInStructure={addUserInStructure}
        isAdmin={user.admin}
        modifyRole={modifyRole}
        deleteUserFromStructure={deleteUserFromStructure}
      />
    </div>
  );
};
