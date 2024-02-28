import { useEffect } from "react";
import { useRouter } from "next/router";
import API from "utils/API";

/**
 * Redirects the user if already logged in
 * @returns null
 */
const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (API.isAuth()) router.push("/backend/user-profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null;
}

export default useAuthRedirect;
