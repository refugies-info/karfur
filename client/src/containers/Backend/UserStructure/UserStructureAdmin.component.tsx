/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "../../../services/UserStructure/userStructure.actions";
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
import { ObjectId } from "mongodb";
import API from "../../../utils/API";

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

interface Props {
  location: any;
}

export const UserStructureAdminComponent = (props: Props) => {
  const [structure, setStructure] = useState(null);
  const isLoading = false;

  console.log("location", props.location.state);
  console.log("structur", structure);
  //   const userStructure = useSelector(userStructureSelector);
  const user = useSelector(userSelector);

  const structureId = props.location.state.structure;
  console.log("structureId", structureId);
  useEffect(() => {
    const loadStructure = async () => {
      const data = await API.getStructureById(structureId, true, "fr", true);
      setStructure(data.data.data);
    };
    loadStructure();

    // if (userStructure) {
    //   dispatch(
    //     fetchUserStructureActionCreator({
    //       structureId: userStructure._id,
    //       shouldRedirect: true,
    //     })
    //   );
    // }
    window.scrollTo(0, 0);
  }, []);

  //   const isLoadingFetch = useSelector(
  //     isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  //   );
  //   const isLoadingUpdate = useSelector(
  //     isLoadingSelector(LoadingStatusKey.UPDATE_USER_STRUCTURE)
  //   );

  //   const isLoading = isLoadingFetch || isLoadingUpdate;

  //   const membres = useSelector(userStructureMembresSelector);

  const addUserInStructure = (userId: ObjectId) => {
    // if (!userStructure) return;
    // dispatch(
    //   updateUserStructureActionCreator({
    //     modifyMembres: true,
    //     data: { structureId: userStructure._id, userId, type: "create" },
    //   })
    // );
  };

  const modifyRole = (
    userId: ObjectId,
    role: "contributeur" | "administrateur"
  ) => {
    // if (!userStructure) return;
    // dispatch(
    //   updateUserStructureActionCreator({
    //     modifyMembres: true,
    //     data: {
    //       structureId: userStructure._id,
    //       userId,
    //       newRole: role,
    //       type: "modify",
    //     },
    //   })
    // );
  };

  const deleteUserFromStructure = (userId: ObjectId) => {
    // if (!userStructure) return;
    // dispatch(
    //   updateUserStructureActionCreator({
    //     modifyMembres: true,
    //     data: {
    //       structureId: userStructure._id,
    //       userId,
    //       type: "delete",
    //     },
    //   })
    // );
  };

  if (isLoading) {
    return <UserStructureLoading />;
  }

  return <div>Hello</div>;

  //   if (!userStructure) return <div>No structure</div>;

  //   if (userStructure.status === "En attente")
  //     return (
  //       <ErrorContainer>
  //         <ErrorText>
  //           Votre structure n'a pas été validée. Veuillez contacter l'équipe de
  //           réfugiés.info via le live chat en bas à droite de votre écran.
  //         </ErrorText>
  //       </ErrorContainer>
  //     );

  //   return (
  //     <UserStructureDetails
  //       picture={userStructure.picture}
  //       name={userStructure.nom}
  //       acronyme={userStructure.acronyme}
  //       membres={membres}
  //       // @ts-ignore
  //       userId={user.userId}
  //       structureId={userStructure._id}
  //       addUserInStructure={addUserInStructure}
  //       isAdmin={user.admin}
  //       modifyRole={modifyRole}
  //       deleteUserFromStructure={deleteUserFromStructure}
  //     />
  //   );
};
