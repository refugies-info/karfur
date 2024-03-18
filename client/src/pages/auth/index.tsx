import React, { ReactElement, useCallback, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getPath } from "routes";
import { logger } from "logger";
import { useAuthRedirect, useLogin, useRegisterFlow } from "hooks";
import { googleProvider } from "utils/googleSignIn";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { isValidEmail } from "lib/validateFields";
import { getRegisterInfos } from "lib/loginRedirect";
import { Event } from "lib/tracking";
import SEO from "components/Seo";
import ErrorMessage from "components/UI/ErrorMessage";
import Layout from "components/Pages/auth/Layout";
import Loader from "components/Pages/auth/Loader";
import GoogleIcon from "assets/auth/providers/google-icon.svg";
import MicrosoftIcon from "assets/auth/providers/microsoft-icon.svg";
import OutlookIcon from "assets/auth/providers/outlook-icon.svg";
// import DataInclusionIcon from "assets/auth/providers/data-inclusion-icon.svg";
import styles from "scss/components/auth.module.scss";

const AuthEmail = () => {
  useAuthRedirect(false);
  const router = useRouter();
  const { logUser, handleError } = useLogin();
  const { start } = useRegisterFlow(null);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      if (!isValidEmail(email)) {
        setFormError("Veuillez entrer une adresse email valide");
        return;
      }
      try {
        Event("AUTH", "password login", "start");
        const res = await API.checkUserExists(email);
        router.push(getPath("/auth/connexion", "fr", `?email=${email}${res.verificationCode ? "&2fa=true" : ""}`));
      } catch (e) {
        router.push(getPath("/auth/inscription", "fr", `?email=${email}`));
      }
    },
    [router, email],
  );

  const loginGoogle = useCallback(() => {
    if (!googleProvider) {
      logger.error("[loginGoogle] Wrong Google provider configuration");
      return;
    }
    Event("AUTH", "google login", "start");
    googleProvider.useGoogleLogin({
      flow: "auth-code",
      onSuccess: ({ code }) => {
        setIsLoading(true);
        const registerInfos = getRegisterInfos();
        API.login({
          authGoogle: {
            authCode: code,
          },
          role: registerInfos?.role, // set role in case new account
        })
          .then((res) => {
            Event("AUTH", "google login", "success");
            if (res.userCreated) start(res.token, registerInfos?.role);
            else logUser(res.token);
          })
          .catch((e) => {
            setIsLoading(false);
            const error = handleError(
              e.response?.data?.code,
              e.response?.data?.data?.email || "",
              e.response?.data?.data,
            );
            if (error) setError(error);
          });
      },
      onError: (err) => {
        setIsLoading(false);
        logger.error("[loginGoogle] Failed to login with google", err);
        setError("Erreur, vous n'êtes pas authentifié avec votre compte Google, veuillez réessayer.");
      },
    })();
  }, [logUser, start, handleError]);

  const loginMicrosoft = useCallback(async () => {
    try {
      setIsLoading(true);
      Event("AUTH", "microsoft login", "start");
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
          setIsLoading(false);
          setError("Erreur, vous n'êtes pas authentifié avec votre compte Microsoft, veuillez réessayer.");
        }
      }
    }
  }, []);
  // const loginInclusionConnect = useCallback(() => {}, []);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO
        title="Bienvenue"
        description="Votre compte Réfugiés.info vous permet d’avoir une expérience personnalisée."
      />

      {isLoading ? (
        <Loader text="Connexion en cours..." />
      ) : (
        <>
          <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
            Retour
          </Button>
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
                value: email,
                onChange: (e: any) => setEmail(e.target.value),
              }}
            />

            <Button
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              className={styles.button}
              nativeButtonProps={{ type: "submit" }}
              disabled={loading}
            >
              Continuer
            </Button>
          </form>

          <div className={cls(styles.separator, styles.mx)}>
            <span>ou connectez-vous avec</span>
          </div>

          <Button onClick={loginGoogle} className={cls(styles.button, "mb-4")} priority="tertiary">
            <Image src={GoogleIcon} width={24} height={24} alt="" className="me-2" />
            Google
          </Button>
          <Button onClick={loginMicrosoft} className={cls(styles.button, "mb-4")} priority="tertiary">
            <Image src={MicrosoftIcon} width={24} height={24} alt="" className="me-2" />
            <Image src={OutlookIcon} width={24} height={24} alt="" className="me-2" />
            Microsoft ou Outlook
          </Button>
          {/* <Button onClick={loginInclusionConnect} className={cls(styles.button, "mb-4")} priority="tertiary">
          <Image src={DataInclusionIcon} width={24} height={24} alt="" className="me-2" />
          Inclusion Connect
        </Button> */}

          <ErrorMessage error={error} />
        </>
      )}
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout loginHelp>{page}</Layout>;
