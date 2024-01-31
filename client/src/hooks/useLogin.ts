import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { setAuthToken } from "utils/authToken";
import { getLoginRedirect } from "lib/loginRedirect";
import { fetchUserActionCreator } from "services/User/user.actions";
import { userDetailsSelector } from "services/User/user.selectors";
import useAuth from "./useAuth";

const useLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userDetails = useSelector(userDetailsSelector);
  const [hasRedirected, setHasRedirected] = useState<"no" | "pending" | "yes">("no");
  const { isAuth } = useAuth();

  const logUser = useCallback((token: string) => {
    setAuthToken(token);
    dispatch(fetchUserActionCreator());
    setHasRedirected("pending");
  }, [dispatch]);

  const handleError = useCallback((errorCode: string | undefined, email: string): string | null => {
    if (errorCode === "NO_CODE_SUPPLIED") {
      if (!email) return ("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      router.push(getPath("/auth/code-securite", "fr", `?email=${email}`));
      return null;
    }
    if (errorCode === "INVALID_PASSWORD") return "Mot de passe incorrect. Réessayez ou cliquez sur 'Mot de passe oublié' pour le réinitialiser.";
    if (errorCode === "USER_DELETED") return "Cet utilisateur n'existe pas ou a été supprimé. Veuillez créer un nouveau compte.";
    return ("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
  }, [router]);

  useEffect(() => {
    if (hasRedirected === "pending" && isAuth && userDetails) {
      setHasRedirected("yes");
      router.push(getLoginRedirect(userDetails?.roles));
    }
  }, [userDetails, isAuth, hasRedirected, router]);

  return { logUser, handleError };
}

export default useLogin;
