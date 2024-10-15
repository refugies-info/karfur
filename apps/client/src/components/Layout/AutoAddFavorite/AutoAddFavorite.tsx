import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { encode } from "querystring";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "~/components/UI/Toast";
import { useAuth } from "~/hooks";
import { isContentFavorite } from "~/hooks/useFavorites";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import { userDetailsSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";

const AutoAddFavorite = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const favoriteContentId = router.query.addFavorite as string;
  const userDetails = useSelector(userDetailsSelector);
  const [showFavoriteToast, setShowFavoriteToast] = useState<boolean>(false);

  useEffect(() => {
    if (favoriteContentId && isAuth && userDetails) {
      const isAlreadyFavorite = isContentFavorite(userDetails, favoriteContentId);
      if (isAlreadyFavorite) return;

      API.addUserFavorite({ dispositifId: favoriteContentId }).then(() => {
        dispatch(fetchUserActionCreator());
        setShowFavoriteToast(true);
      });

      // remove parameter from url
      const { pathname, query } = router;
      const params = new URLSearchParams(encode(query));
      params.delete("addFavorite");
      router.replace({ pathname, query: params.toString() }, undefined, { shallow: true });
    }
  }, [favoriteContentId, isAuth, userDetails, dispatch, router]);

  return (
    <Toast open={showFavoriteToast} closeCallback={() => setShowFavoriteToast(false)}>
      {t("Dispositif.messageAddedToFavorites")}
    </Toast>
  );
};

export default AutoAddFavorite;
