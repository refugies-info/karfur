import { ObjectId } from "mongodb";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { DispositifPinned, User } from "types/interface";
import API from "utils/API";
import { userDetailsSelector } from "services/User/user.selectors";
import { useCallback, useEffect, useState } from "react";
import { fetchUserActionCreator } from "services/User/user.actions";
import { toggleUserFavoritesModalActionCreator } from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";

const isContentFavorite = (userDetails: User | null, id: ObjectId) => {
  if ((userDetails?.cookies?.dispositifsPinned || []).length === 0) return false;
  return !!userDetails?.cookies?.dispositifsPinned
    ?.filter(c => c)
    .map(c => c._id).includes(id.toString());
}

const useFavorites = (contentId: ObjectId) => {
  const userDetails = useSelector(userDetailsSelector);
  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(isContentFavorite(userDetails, contentId));

  useEffect(() => {
    setIsFavorite(isContentFavorite(userDetails, contentId))
  }, [userDetails, contentId])

  const addToFavorites = useCallback(() => {
    if (API.isAuth() && userDetails) {
      if (isFavorite) return;
      const currentDispositifsPinned = userDetails.cookies?.dispositifsPinned || [];
      const newUserCookies = {
        _id: userDetails._id,
        cookies: { ...(userDetails.cookies || {}) },
      };
      newUserCookies.cookies.dispositifsPinned = [
        ...currentDispositifsPinned,
        {
          _id: contentId.toString(),
          datePin: moment()
        }
      ];

      API.set_user_info(newUserCookies).then(() => {
        dispatch(fetchUserActionCreator());
        dispatch(toggleUserFavoritesModalActionCreator(true));
      });
    } else {
      dispatch(toggleUserFavoritesModalActionCreator(true));
    }
  }, [userDetails, contentId, isFavorite, dispatch]);

  return { isFavorite, addToFavorites };
}

export default useFavorites;
