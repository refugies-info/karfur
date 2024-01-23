import { ReactElement, useCallback, useMemo, useState } from "react";
import { Col, Row } from "reactstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import API from "utils/API";
import { useLogin } from "hooks";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthEmail = () => {
  const router = useRouter();
  const { logUser } = useLogin();
  const email = useMemo(() => router.query.email as string, [router.query]);
  const [error, setError] = useState("");

  const submit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const code = e.target.code.value;
      try {
        const res = await API.checkCode({ email, code });
        if (!res.token) throw new Error();
        logUser(res.token);
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "WRONG_CODE") {
          setError("Code invalide, veuillez réessayer");
        } else {
          setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
      }
    },
    [logUser, email],
  );

  const sendCode = useCallback((e: any) => {
    e.preventDefault();
    // TODO: send code to email again
  }, []);

  if (!email) return null;

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Bienvenue" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Entrez le code reçu</h1>
          <p className={styles.subtitle}>
            Un code temporaire à 6 chiffres vous a été envoyé à {email}
            <br />
            <Link href="/auth" className="text-decoration-underline">
              Ce n’est pas vous ?
            </Link>{" "}
            {/* TODO: style */}
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Code de connexion temporaire"
            state={!error ? "default" : "error"}
            stateRelatedMessage={error}
            nativeInputProps={{
              autoFocus: true,
              name: "code",
            }}
          />

          <Button
            iconId="fr-icon-check-line"
            iconPosition="right"
            className={cls(styles.button, "mt-8 mb-4")}
            nativeButtonProps={{ type: "submit" }}
          >
            Valider
          </Button>
          <Button
            iconId="fr-icon-mail-line"
            iconPosition="right"
            onClick={sendCode}
            className={styles.button}
            priority="tertiary"
          >
            Renvoyer le code
          </Button>
        </form>

        <Row className={styles.space_top}>
          <Col>
            <Button
              linkProps={{
                href: "https://mail.google.com/mail/u/0/",
              }}
              className={styles.button}
              priority="tertiary"
            >
              Ouvrir Gmail
            </Button>
          </Col>
          <Col>
            <Button
              linkProps={{
                href: "https://outlook.live.com/mail/0/",
              }}
              className={styles.button}
              priority="tertiary"
            >
              Ouvrir Outlook
            </Button>
          </Col>
        </Row>
        <p className={cls(styles.small, "mt-6", "text-center")}>Pensez à vérifiez votre courrier indésirable !</p>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;