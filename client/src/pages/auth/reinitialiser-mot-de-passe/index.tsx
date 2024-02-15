import { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { ResetPasswordResponse } from "@refugies-info/api-types";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { getPath } from "routes";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import { ForgotPassword } from "components/User";
import styles from "scss/components/auth.module.scss";

const AuthForgotPassword = () => {
  const router = useRouter();
  const email: string = useMemo(() => router.query.email as string, [router.query]);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO
        title="Mot de passe oublié"
        description="Nous allons vous envoyer un mail avec des instructions pour le réinitialiser."
      />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>

      <div className={styles.title}>
        <h1>Mot de passe oublié</h1>
        <p className={styles.subtitle}>Nous allons vous envoyer un mail avec des instructions pour le réinitialiser.</p>
      </div>

      <ForgotPassword
        email={email}
        successCallback={(res: ResetPasswordResponse) =>
          router.push(getPath("/auth/reinitialiser-mot-de-passe/mail-envoye", "fr", `?email=${res.email}`))
        }
        buttonFullWidth
      />
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthForgotPassword;

// override default layout and options
AuthForgotPassword.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
