import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { getPath, PathNames } from "routes";

const useChangeLanguage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const changeLanguage = useCallback((selectedLn: string, navigationType: "push" | "replace" = "replace", callback?: () => void) => {
    dispatch(toggleLangueActionCreator(selectedLn));
    const { pathname, query } = router;
    const url = {
      pathname: getPath(pathname as PathNames, selectedLn),
      query,
    };
    if (navigationType === "push") {
      router.push(url, undefined, { locale: selectedLn }).then(() => { callback?.() });
    } else {
      router.replace(url, undefined, { locale: selectedLn }).then(() => { callback?.() });
    }
  }, [dispatch, router]);

  return { changeLanguage }
}

export default useChangeLanguage;
