import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { useRegisterFlow } from "hooks";
import { logger } from "logger";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string>("");
  const { userId, userDetails, getStepCount, next, back } = useRegisterFlow("pseudo");
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  useEffect(() => {
    if (userDetails?.username) setUsername(userDetails.username);
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userId || !username) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { username },
          action: "modify-my-details",
        });
        next(null);
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "USERNAME_TAKEN") {
          setError("Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre.");
        } else {
          logger.error(e);
          setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
      }
    },
    [router, userId, next, username],
  );

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre pseudonyme" />
      <div className={styles.container_inner}>
        <Button
          priority="tertiary"
          size="small"
          iconId="fr-icon-arrow-left-line"
          onClick={back}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title="Votre pseudonyme" />

        <div className={cls(styles.title, "mt-14")}>
          <h1 className={styles.sm}>Choisissez un pseudonyme</h1>
          <p className={styles.subtitle}>
            Au pied de chaque fiche, nous affichons les contributeurs ayant participé à sa rédaction et sa traduction.
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Votre pseudonyme"
            className="mt-14"
            state={!!error ? "error" : "default"}
            stateRelatedMessage={error}
            nativeInputProps={{
              autoFocus: true,
              value: username,
              onChange: (e: any) => setUsername(e.target.value),
            }}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-7")}
            nativeButtonProps={{ type: "submit" }}
            disabled={loading}
          >
            Suivant
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;
