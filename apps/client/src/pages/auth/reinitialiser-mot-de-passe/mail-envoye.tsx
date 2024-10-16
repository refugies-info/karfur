import { Button } from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import Layout from "~/components/Pages/auth/Layout";
import SEO from "~/components/Seo";
import { ForgotPasswordMailSent } from "~/components/User";
import { useAuthRedirect } from "~/hooks";
import { cls } from "~/lib/classname";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import styles from "~/scss/components/auth.module.scss";

const AuthResetMailSent = () => {
  useAuthRedirect(false);
  const router = useRouter();
  const email = useMemo(() => router.query.email as string, [router.query]);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Un lien a été envoyé" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.title}>
        <h1>Un lien a été envoyé</h1>
        <p className={styles.subtitle}>
          Nous venons de vous envoyer un mail pour réinitialiser votre mot de passe à l’adresse suivante&nbsp;: {email}.
          <br />
          <br />
          Si vous ne recevez pas de mail d’ici quelques minutes, pensez à vérifier vos courriers indésirables ou vos
          spams.
        </p>
      </div>
      <ForgotPasswordMailSent email={email} />
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthResetMailSent;

// override default layout and options
AuthResetMailSent.getLayout = (page: ReactElement) => <Layout loginHelp>{page}</Layout>;
