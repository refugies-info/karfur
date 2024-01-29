import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { getPath } from "routes";
import { logger } from "logger";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { userIdSelector } from "services/User/user.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId && !isUserLoading) dispatch(fetchUserActionCreator());
  }, [userId, isUserLoading, dispatch]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      const pseudo = e.target.pseudo.value;
      if (!userId || !pseudo) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { username: pseudo },
          action: "modify-my-details",
        });
        router.push(getPath("/auth/inscription/territoire", "fr"));
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
    [router, userId],
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
          onClick={() => router.back()}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={2} stepCount={3} title="Votre pseudonyme" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Choisissez un pseudonyme</h1>
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
              name: "pseudo",
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
