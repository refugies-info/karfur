import API from "@/utils/API";
import { useRouter } from "next/router";
import { useEffectOnce } from "react-use";

/**
 * Redirects the user if already logged in or missing email in parameters
 * @returns null
 */
const useAuthRedirect = (needEmail: boolean) => {
  const router = useRouter();

  useEffectOnce(() => {
    if (API.isAuth()) router.push("/backend/user-profile");
    const email = new URLSearchParams(window.location.search).get("email");
    if (!email && needEmail) router.push("/fr/auth");
  });

  return null;
};

export default useAuthRedirect;
