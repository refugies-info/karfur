import type { Id, SimpleDispositif } from "@refugies-info/api-types";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavoritesActionCreator } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { userFavoritesSelector } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.selectors";
import API from "~/utils/API";
import useAuth from "./useAuth";

/**
 * Helper function to check if a content is in the user's favorites list
 * @param favorites List of user's favorite content
 * @param id Content ID to check
 * @returns boolean indicating if the content is favorited
 */
export const isContentFavorite = (favorites: SimpleDispositif[], id: Id | null) => {
  if (id === null) return false;
  if (favorites.length === 0) return false;
  return !!favorites.find((c) => c._id === id);
};

/**
 * Hook to manage user's favorites for a specific content
 * @param contentId ID of the content to check/manage favorite status
 * @returns Object containing favorite status and functions to add/remove from favorites
 */
const useFavorites = (contentId: Id | null) => {
  const favorites = useSelector(userFavoritesSelector);
  const router = useRouter();
  const locale = useMemo(() => router.locale || "fr", [router.locale]);

  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  // Memoized computation of whether the current content is favorited
  const isFavorite = useMemo(
    () => favorites !== null && isContentFavorite(favorites, contentId),
    [favorites, contentId],
  );

  // Callback to refresh favorites after successful API operations
  const successCallback = useCallback(() => {
    dispatch(fetchUserFavoritesActionCreator(locale));
  }, [dispatch, locale]);

  // Add content to favorites if authenticated and not already favorited
  const addToFavorites = useCallback(() => {
    if (isAuth) {
      if (isFavorite || !contentId) return;
      API.addUserFavorite({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [contentId, isFavorite, successCallback, isAuth]);

  // Remove content from favorites if authenticated and currently favorited
  const deleteFromFavorites = useCallback(() => {
    if (isAuth) {
      if (!isFavorite || !contentId) return;
      API.deleteUserFavorites({ dispositifId: contentId.toString() }).then(successCallback);
    }
  }, [contentId, isFavorite, successCallback, isAuth]);

  return { isFavorite, addToFavorites, deleteFromFavorites };
};

export default useFavorites;
