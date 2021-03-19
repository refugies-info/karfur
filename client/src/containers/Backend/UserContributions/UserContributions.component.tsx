/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserContributionsActionCreator } from "../../../services/UserContributions/userContributions.actions";
import { userContributionsSelector } from "../../../services/UserContributions/userContributions.selectors";
import {
  userStructureDisposAssociesSelector,
  userStructureNameSelector,
} from "../../../services/UserStructure/userStructure.selectors";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { formatContributions } from "./functions";

export const UserContributionsComponent = () => {
  const dispatch = useDispatch();

  const userContributions = useSelector(userContributionsSelector);
  const userStructureContributions = useSelector(
    userStructureDisposAssociesSelector
  );
  const userStructureName = useSelector(userStructureNameSelector);
  const isLoadingUserContrib = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_CONTRIBUTIONS)
  );
  const isLoadingUserStructureContrib = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER_STRUCTURE)
  );
  const isLoading = isLoadingUserContrib || isLoadingUserStructureContrib;

  useEffect(() => {
    dispatch(fetchUserContributionsActionCreator());
  }, []);

  const contributions = formatContributions(
    userContributions,
    userStructureContributions,
    userStructureName
  );

  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div>
      Hello
      {contributions.map((contrib, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "row" }}>
          <div>{"titre info : " + contrib.titreInformatif}</div>
          <div>{" titre marque : " + contrib.titreMarque}</div>
          <div>{" respo : " + contrib.responsabilite}</div>
          <div>{" status : " + contrib.status}</div>
        </div>
      ))}
    </div>
  );
};
