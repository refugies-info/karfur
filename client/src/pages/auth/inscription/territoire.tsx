import { ReactElement, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const [search, onSearchChange] = useState("");
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const submit = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre territoire" />
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

        <Stepper currentStep={2} stepCount={3} title="Votre territoire" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Où souhaitez-vous chercher des dispositifs&nbsp;?</h1>
          <p className={styles.subtitle}>
            Nous vous montrerons uniquement les contenus susceptibles de vous intéresser. Pas d’inquiétude, vous pourrez
            toujours modifier !
          </p>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="location" className="mb-2">
            Nom ou numéro du département(s)
          </label>
          <SearchBar
            renderInput={({ className, id, placeholder, type }) => (
              <input
                ref={setInputElement}
                className={className}
                name="location"
                id={id}
                placeholder={placeholder}
                type={type}
                value={search}
                // Note: The default behavior for an input of type 'text' is to clear the input value when the escape key is pressed.
                // However, due to a bug in @gouvfr/dsfr the escape key event is not propagated to the input element.
                // As a result this onChange is not called when the escape key is pressed.
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                // Same goes for the keydown event so this is useless but we hope the bug will be fixed soon.
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    if (inputElement !== null) {
                      inputElement.blur();
                    }
                  }
                }}
              />
            )}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-14")}
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
