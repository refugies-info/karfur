import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { GetUserInfoResponse, Id } from "@refugies-info/api-types";
import API from "utils/API";
import { userDetailsSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { fetchUserFavoritesActionCreator } from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import useAuth from "./useAuth";

export const isContentFavorite = (userDetails: GetUserInfoResponse | null, id: Id | null) => {
  if (id === null) return false;
  if ((userDetails?.favorites || []).length === 0) return false;
  return !!(userDetails?.favorites || []).find(c => c.dispositifId === id);
}

const useFavorites = (contentId: Id | null) => {
  const userDetails = useSelector(userDetailsSelector);
  const router = useRouter();
  const locale = useMemo(() => router.locale || "fr", [router.locale]);

  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const [isFavorite, setIsFavorite] = useState(isContentFavorite(userDetails, contentId));

  useEffect(() => {
    setIsFavorite(isContentFavorite(userDetails, contentId))
  }, [userDetails, contentId])

  const successCallback = useCallback(() => {
    dispatch(fetchUserActionCreator());
    dispatch(fetchUserFavoritesActionCreator(locale));
  }, [dispatch, locale]);

  const addToFavorites = useCallback(() => {
    if (isAuth && userDetails) {
      if (isFavorite || !contentId) return;
      API.addUserFavorite({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [userDetails, contentId, isFavorite, successCallback, isAuth]);

  const deleteFromFavorites = useCallback(() => {
    if (isAuth && userDetails) {
      if (!isFavorite || !contentId) return;
      API.deleteUserFavorites({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [userDetails, contentId, isFavorite, successCallback, isAuth]);

  return { isFavorite, addToFavorites, deleteFromFavorites };
}

export default useFavorites;
