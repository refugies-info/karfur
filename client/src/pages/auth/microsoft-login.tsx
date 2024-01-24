import { ReactElement, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { useLogin } from "hooks";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthEmail = () => {
  const router = useRouter();
  const code: string = useMemo(() => router.query.code as string, [router.query]);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const { logUser } = useLogin();

  useEffect(() => {
    if (code && !requestSent) {
      setRequestSent(true);
      API.login({
        authMicrosoft: {
          authCode: code,
        },
      })
        .then((res) => logUser(res.token))
        .catch((e) => {
          const errorCode = e.response?.data?.code;
          const email = e.response?.data?.data?.email;
          if (errorCode === "NO_ACCOUNT") {
            router.push(getPath("/auth/inscription", "fr", `?email=${email}`));
          } else {
            setError("Erreur, vous n'êtes pas authentifié avec votre compte Microsoft, veuillez réessayer.");
          }
        });
    }
  }, [code, requestSent, logUser, router]);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Connexion en cours..." />

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>{!error ? "Connexion en cours..." : "Erreur"}</h1>
          <p className={styles.subtitle}>{!error ? "Ne quittez pas la page" : error}</p>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
