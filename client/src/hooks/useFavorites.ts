import { useDispatch, useSelector } from "react-redux";
import API from "utils/API";
import { userDetailsSelector } from "services/User/user.selectors";
import { useCallback, useEffect, useState } from "react";
import { fetchUserActionCreator } from "services/User/user.actions";
import { GetUserInfoResponse, Id } from "api-types";

const isContentFavorite = (userDetails: GetUserInfoResponse | null, id: Id | null) => {
  if (id === null) return false;
  if ((userDetails?.favorites || []).length === 0) return false;
  return !!(userDetails?.favorites || []).find(c => c.dispositifId === id);
}

const useFavorites = (contentId: Id | null) => {
  const userDetails = useSelector(userDetailsSelector);
  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(isContentFavorite(userDetails, contentId));

  useEffect(() => {
    setIsFavorite(isContentFavorite(userDetails, contentId))
  }, [userDetails, contentId])

  const addToFavorites = useCallback(() => {
    if (API.isAuth() && userDetails) {
      if (isFavorite || contentId === null) return;
      API.addUserFavorite({ dispositifId: contentId.toString() }).then(() => {
        dispatch(fetchUserActionCreator());
      });
    }
  }, [userDetails, contentId, isFavorite, dispatch]);

  const deleteFromFavorites = useCallback(() => {
    if (API.isAuth() && userDetails) {
      if (!isFavorite || contentId === null) return;
      API.deleteUserFavorites({ dispositifId: contentId.toString() }).then(() => {
        dispatch(fetchUserActionCreator());
      });
    }
  }, [userDetails, contentId, isFavorite, dispatch]);

  return { isFavorite, addToFavorites, deleteFromFavorites };
}

export default useFavorites;
