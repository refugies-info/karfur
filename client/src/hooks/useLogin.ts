import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchUserActionCreator } from "services/User/user.actions";
import { setAuthToken } from "utils/authToken";
import { getLoginRedirect } from "lib/loginRedirect";

const useLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter()

  const logUser = useCallback((token: string) => {
    setAuthToken(token);
    dispatch(fetchUserActionCreator());
    const path = getLoginRedirect();
    router.push(path);
  }, [dispatch, router]);

  return { logUser };
}

export default useLogin;
