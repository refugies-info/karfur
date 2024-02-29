import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import API from "utils/API";

/**
 * Redirects the user if already logged in or missing email in parameters
 * @returns null
 */
const useAuthRedirect = (needEmail: boolean) => {
  const router = useRouter();
  const email: string = useMemo(() => router.query.email as string, [router.query]);

  useEffect(() => {
    if (API.isAuth()) router.push("/backend/user-profile");
    if (!email && needEmail) router.push("/fr/auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null;
}

export default useAuthRedirect;
