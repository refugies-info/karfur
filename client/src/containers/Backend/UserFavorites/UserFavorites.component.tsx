/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserFavoritesActionCreator } from "../../../services/UserFavoritesInLocale/UserFavoritesInLocale.actions";

export interface PropsBeforeInjection {}

export const UserFavoritesComponent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserFavoritesActionCreator("fr"));
  }, []);

  return <div>Favoris</div>;
};
