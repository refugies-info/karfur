import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { getPath, type PathNames } from "routes";
import { toggleLangueActionCreator } from "~/services/Langue/langue.actions";

const useChangeLanguage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const changeLanguage = useCallback(
    (selectedLn: string, navigationType: "push" | "replace" = "replace", callback?: () => void) => {
      dispatch(toggleLangueActionCreator(selectedLn));
      const { pathname, query } = router;
      const url = {
        pathname: getPath(pathname as PathNames, selectedLn),
        query,
      };
      if (navigationType === "push") {
        setLoading(true);
        router.push(url, undefined, { locale: selectedLn }).then(() => {
          if (callback) {
            setTimeout(() => {
              callback();
              setLoading(false);
            }, 50);
          } else {
            setLoading(false);
          }
        });
      } else {
        setLoading(true);
        router.replace(url, undefined, { locale: selectedLn }).then(() => {
          if (callback) {
            setTimeout(() => {
              callback();
              setLoading(false);
            }, 50);
          } else {
            setLoading(false);
          }
        });
      }
    },
    [dispatch, router],
  );

  return { changeLanguage, loading };
};

export default useChangeLanguage;
