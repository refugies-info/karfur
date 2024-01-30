import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { fetchUserActionCreator } from "services/User/user.actions";
import { setAuthToken } from "utils/authToken";
import { getLoginRedirect } from "lib/loginRedirect";
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

  useEffect(() => {
    if (hasRedirected === "pending" && isAuth && userDetails) {
      setHasRedirected("yes");
      router.push(getLoginRedirect(userDetails?.roles));
    }
  }, [userDetails, isAuth, hasRedirected, router]);

  return { logUser };
}

export default useLogin;
