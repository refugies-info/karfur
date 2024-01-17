import { ReactElement, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthEmail = () => {
  const router = useRouter();
  const email = useMemo(() => router.query.email, [router.query]);

  const sendMail = useCallback(() => {
    if (!email) return;
    // TODO: resend email
  }, [email]);

  const openChat = useCallback(() => {
    // TODO open chat
  }, []);

  return (
    <div>
      <SEO title="Bienvenue" />
      <div>
        <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
          Retour
        </Button>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>Un lien a été envoyé</h1>
            <p className={styles.subtitle}>
              Nous venons de vous envoyer un mail pour réinitialiser votre mot de passe à l’adresse suivante&nbsp;:{" "}
              {email}.
              <br />
              <br />
              Si vous ne recevez pas de mail d’ici quelques minutes, pensez à vérifier vos courriers indésirables ou vos
              spams.
            </p>
          </div>
          <Button
            iconId="fr-icon-mail-line"
            iconPosition="right"
            onClick={sendMail}
            className={cls(styles.button, "mb-4")}
          >
            Renvoyer le lien de réinitialisation
          </Button>
          <Button onClick={openChat} className={cls(styles.button)} priority="tertiary">
            Contacter le chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
