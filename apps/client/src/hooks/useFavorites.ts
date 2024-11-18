import { Id, SimpleDispositif } from "@refugies-info/api-types";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavoritesActionCreator } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { userFavoritesSelector } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import API from "~/utils/API";
import useAuth from "./useAuth";

export const isContentFavorite = (favorites: SimpleDispositif[], id: Id | null) => {
  if (id === null) return false;
  if (favorites.length === 0) return false;
  return !!favorites.find((c) => c._id === id);
};

const useFavorites = (contentId: Id | null) => {
  const favorites = useSelector(userFavoritesSelector);
  const router = useRouter();
  const locale = useMemo(() => router.locale || "fr", [router.locale]);

  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const isFavorite = useMemo(() => isContentFavorite(favorites, contentId), [favorites, contentId]);

  const successCallback = useCallback(() => {
    dispatch(fetchUserFavoritesActionCreator(locale));
  }, [dispatch, locale]);

  const addToFavorites = useCallback(() => {
    if (isAuth) {
      if (isFavorite || !contentId) return;
      API.addUserFavorite({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [contentId, isFavorite, successCallback, isAuth]);

  const deleteFromFavorites = useCallback(() => {
    if (isAuth) {
      if (!isFavorite || !contentId) return;
      API.deleteUserFavorites({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [contentId, isFavorite, successCallback, isAuth]);

  return { isFavorite, addToFavorites, deleteFromFavorites };
};

export default useFavorites;
