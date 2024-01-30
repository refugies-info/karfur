import { ReactElement, useState, useMemo, useEffect } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import Image from "next/image";
import { RoleName } from "@refugies-info/api-types";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useRegisterFlow } from "hooks";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { hasRole } from "lib/hasRole";
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
  const [error, setError] = useState("");
  const [role, setRole] = useState<RoleName.USER | RoleName.CAREGIVER | RoleName.CONTRIB | RoleName.TRAD | null>(null);
  const { userId, userDetails, getStepCount, next } = useRegisterFlow("objectif");

  useEffect(() => {
    if (hasRole(userDetails, RoleName.TRAD)) setRole(RoleName.TRAD);
    if (hasRole(userDetails, RoleName.CAREGIVER)) setRole(RoleName.CAREGIVER);
    if (hasRole(userDetails, RoleName.CONTRIB)) setRole(RoleName.CONTRIB);
  }, [userDetails]);

  const stepCount = useMemo(() => getStepCount(role ? [role] : null), [role, getStepCount]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userId || !role) return;
      try {
        if (role && role !== RoleName.USER) {
          await API.updateUser(userId.toString(), { user: { roles: [role] }, action: "modify-my-details" }); // FIXME what if back and change role?
        }
        next([role]);
      } catch (e: any) {
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId, role, next],
  );

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre objectif" />
      <div className={styles.container_inner}>
        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title="Votre objectif" />

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
                label: "Créer mon « Espace aidant »",
                hintText: "Pour les professionnels et les bénévoles qui accompagnent des bénéficiaires",
                nativeInputProps: {
                  checked: role === RoleName.CAREGIVER,
                  onChange: () => setRole(RoleName.CAREGIVER),
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconStructure} width={48} height={48} />,
                label: "Recenser mon dispositif",
                hintText: "Pour les membres et responsables de structure",
                nativeInputProps: {
                  checked: role === RoleName.CONTRIB,
                  onChange: () => setRole(RoleName.CONTRIB),
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconTranslate} width={48} height={48} />,
                label: "Traduire une fiche",
                hintText: "Pour les bilingues qui souhaitent contribuer",
                nativeInputProps: {
                  checked: role === RoleName.TRAD,
                  onChange: () => setRole(RoleName.TRAD),
                },
              },
              {
                illustration: <Image alt="illustration" src={GoalIconUser} width={26} height={56} />,
                label: "Créer mon espace personnel",
                hintText: "Simplement pour sauvegarder des fiches",
                nativeInputProps: {
                  checked: role === RoleName.USER,
                  onChange: () => setRole(RoleName.USER),
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
