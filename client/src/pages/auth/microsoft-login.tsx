import { ReactElement, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthRedirect, useLogin, useRegisterFlow } from "hooks";
import { getPath } from "routes";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { getRegisterInfos } from "lib/loginRedirect";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";
import { Event } from "lib/tracking";

const AuthMicrosoftLogin = () => {
  useAuthRedirect(false);
  const router = useRouter();
  const code: string = useMemo(() => router.query.code as string, [router.query]);
  const authError: string = useMemo(() => router.query.error as string, [router.query]);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const { logUser, handleError } = useLogin();
  const { start } = useRegisterFlow(null);

  useEffect(() => {
    if (authError) {
      setError("Une erreur est survenue pendant l'authentification.");
      router.push(getPath("/auth", "fr"));
    }
  }, [router, authError]);

  useEffect(() => {
    if (code && !requestSent) {
      setRequestSent(true);
      const registerInfos = getRegisterInfos();
      API.login({
        authMicrosoft: {
          authCode: code,
        },
        role: registerInfos?.role, // set role in case new account
      })
        .then((res) => {
          Event("AUTH", "microsoft login", "success");
          if (res.userCreated) start(res.token, registerInfos?.role);
          else logUser(res.token);
        })
        .catch((e) => {
          const error = handleError(e.response?.data?.code, e.response?.data?.data?.email || "");
          if (error) setError(error);
        });
    }
  }, [code, requestSent, logUser, start, handleError]);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Connexion en cours..." />
      <div className={styles.title}>
        <h1>{!error ? "Connexion en cours..." : "Erreur"}</h1>
        <p className={styles.subtitle}>{!error ? "Ne quittez pas la page" : error}</p>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthMicrosoftLogin;

// override default layout and options
AuthMicrosoftLogin.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
