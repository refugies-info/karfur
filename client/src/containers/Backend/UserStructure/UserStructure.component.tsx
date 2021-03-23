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
declare const window: Window;

export const UserStructureComponent = () => {
  const dispatch = useDispatch();
  const userStructure = useSelector(userStructureSelector);

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
  console.log("memebre", membres);
  if (isLoading) {
    return <UserStructureLoading />;
  }

  return <div>Hello</div>;
};
