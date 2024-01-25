import React, { ReactElement, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getPath } from "routes";
import { logger } from "logger";
import { useLogin } from "hooks";
import { googleProvider } from "utils/googleSignIn";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import GoogleIcon from "assets/auth/providers/google-icon.svg";
import MicrosoftIcon from "assets/auth/providers/microsoft-icon.svg";
import DataInclusionIcon from "assets/auth/providers/data-inclusion-icon.svg";
import styles from "scss/components/auth.module.scss";
import Image from "next/image";

const AuthEmail = () => {
  const router = useRouter();
  const { logUser } = useLogin();
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");

  const submit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      // TODO: check email format
      try {
        const res = await API.checkUserExists(email);
        router.push(getPath("/auth/connexion", "fr", `?email=${email}${res.verificationCode ? "&2fa=true" : ""}`));
      } catch (e) {
        router.push(getPath("/auth/inscription", "fr", `?email=${email}`));
      }
    },
    [router],
  );

  const loginGoogle = useCallback(() => {
    if (!googleProvider) return;
    googleProvider.useGoogleLogin({
      flow: "auth-code",
      onSuccess: ({ code }) => {
        API.login({
          authGoogle: {
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
              setError("Erreur, vous n'êtes pas authentifié avec votre compte Google, veuillez réessayer.");
            }
          });
      },
      onError: (err) => {
        logger.error("[loginGoogle] Failed to login with google", err);
        setError("Erreur, vous n'êtes pas authentifié avec votre compte Google, veuillez réessayer.");
      },
    })();
  }, [router, logUser]);

  const loginMicrosoft = useCallback(async () => {
    try {
      await API.login({
        authMicrosoft: {
          authCode: null, // send a null code to get the auth url
        },
      });
    } catch (e: any) {
      const errorCode = e.response?.data?.code;
      if (errorCode === "SSO_URL") {
        // and redirect if url is provided
        if (e.response.data.data.url) {
          window.location.href = e.response.data.data.url;
        } else {
          setError("Erreur, vous n'êtes pas authentifié avec votre compte Microsoft, veuillez réessayer.");
        }
      }
    }
  }, []);
  const loginInclusionConnect = useCallback(() => {}, []);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO
        title="Bienvenue"
        description="Votre compte Réfugiés.info vous permet d’avoir une expérience personnalisée."
      />

      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Bienvenue&nbsp;!</h1>
          <p className={styles.subtitle}>
            Votre compte Réfugiés.info vous permet d’avoir une expérience personnalisée.
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Adresse mail"
            state={!formError ? "default" : "error"}
            stateRelatedMessage={formError}
            nativeInputProps={{
              autoFocus: true,
              type: "email",
              name: "email",
            }}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={styles.button}
            nativeButtonProps={{ type: "submit" }}
          >
            Continuer
          </Button>
        </form>

        <div className={styles.separator}>
          <span>ou connectez-vous avec</span>
        </div>

        <Button onClick={loginGoogle} className={cls(styles.button, "mb-4")} priority="tertiary">
          <Image src={GoogleIcon} width={24} height={24} alt="" className="me-2" />
          Google
        </Button>
        <Button onClick={loginMicrosoft} className={cls(styles.button, "mb-4")} priority="tertiary">
          <Image src={MicrosoftIcon} width={24} height={24} alt="" className="me-2" />
          Microsoft
        </Button>
        <Button onClick={loginInclusionConnect} className={cls(styles.button, "mb-4")} priority="tertiary">
          <Image src={DataInclusionIcon} width={24} height={24} alt="" className="me-2" />
          Inclusion Connect
        </Button>

        {error && <span className="text-danger">{error}</span>}
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
