import { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import GoalIconTs from "assets/auth/goal-icon-ts.svg";
import GoalIconStructure from "assets/auth/goal-icon-structure.svg";
import GoalIconTranslate from "assets/auth/goal-icon-translate.svg";
import GoalIconUser from "assets/auth/goal-icon-user.svg";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();

  const submit = useCallback(
    (e: any) => {
      e.preventDefault();
      const choice = e.target.goal;
      if (choice === "ts") {
        router.push("/auth/register/structure");
        return;
      }
      if (choice === "structure") {
        router.push("/auth/register/structure");
        return;
      }
      if (choice === "translate") {
        router.push("/auth/register/structure");
        return;
      }
      if (choice === "user") {
        router.push("/auth/register/structure");
        return;
      }
    },
    [router],
  );

  return (
    <div className={styles.container}>
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
                  value: "ts",
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

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-7")}
            nativeButtonProps={{ type: "submit" }}
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
