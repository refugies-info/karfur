import { ReactElement, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import Image from "next/image";
import { RoleName } from "@refugies-info/api-types";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { getPath } from "routes";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { userIdSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Error from "components/Pages/auth/Error";
import GoalIconTs from "assets/auth/goal-icon-ts.svg";
import GoalIconStructure from "assets/auth/goal-icon-structure.svg";
import GoalIconTranslate from "assets/auth/goal-icon-translate.svg";
import GoalIconUser from "assets/auth/goal-icon-user.svg";
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
      const choice = e.target.goal.value;
      if (!userId || !choice) return;
      if (choice === "user") {
        router.push(getPath("/auth/inscription/territoire", "fr"));
        return;
      }
      let role: RoleName[] | null = null;
      let path: string | null = null;
      if (choice === "ts") {
        role = [RoleName.CAREGIVER];
        path = getPath("/auth/inscription/partenaire", "fr");
      }
      if (choice === "structure") {
        role = [RoleName.CONTRIB];
        path = getPath("/auth/inscription/pseudo", "fr");
      }
      if (choice === "translate") {
        role = [RoleName.TRAD];
        path = getPath("/auth/inscription/langue", "fr");
      }
      try {
        if (role) await API.updateUser(userId.toString(), { user: { roles: role }, action: "modify-my-details" });
        if (path) router.push(path);
      } catch (e: any) {
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId],
  );

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre objectif" />
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

        <Stepper currentStep={1} stepCount={3} title="Votre objectif" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Que souhaitez-vous faire&nbsp;?</h1>
          <p className={styles.subtitle}>Vous pourrez compléter votre choix plus tard.</p>
        </div>

        <form onSubmit={submit}>
          <RadioButtons
            name="goal"
            className={styles.radio}
            options={[
              {
                illustration: <Image alt="illustration" src={GoalIconTs} width={48} height={48} />,
                label: "Créer mon « Espace aidant »",
                hintText: "Pour les professionnels et les bénévoles qui accompagnent des bénéficiaires",
                nativeInputProps: {
                  value: "caregiver",
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconStructure} width={48} height={48} />,
                label: "Recenser mon dispositif",
                hintText: "Pour les membres et responsables de structure",
                nativeInputProps: {
                  value: "structure",
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconTranslate} width={48} height={48} />,
                label: "Traduire une fiche",
                hintText: "Pour les bilingues qui souhaitent contribuer",
                nativeInputProps: {
                  value: "translate",
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconUser} width={26} height={56} />,
                label: "Créer mon espace personnel",
                hintText: "Simplement pour sauvegarder des fiches",
                nativeInputProps: {
                  value: "user",
                },
              },
            ]}
          />

          <Error error={error} />

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
