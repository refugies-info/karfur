import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { Col, Row } from "reactstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getLoginRedirect } from "lib/loginRedirect";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";
import isInBrowser from "lib/isInBrowser";

const AuthEmail = () => {
  const router = useRouter();
  const email = useMemo(() => router.query.email, [router.query]);
  const [error, setError] = useState("");

  const submit = useCallback(
    (e: any) => {
      e.preventDefault();
      const code = e.target.code.value;
      // TODO: check code OK and redirect
      const codeOk = true;
      if (codeOk) {
        const path = getLoginRedirect();
        router.push(path);
      } else {
        setError("Code incorrect, veuillez réessayer.");
      }
    },
    [router],
  );

  const sendCode = useCallback((e: any) => {
    e.preventDefault();
    // TODO: send code to email again
  }, []);

  const contact = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["do", "chat:open"]);
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
          <h1>Vérifions que c’est bien vous !</h1>
          <p className={styles.subtitle}>
            Un code temporaire à 6 chiffres vous a été envoyé à {email}
            <br />
            <Link href="/auth" className="text-decoration-underline">
              Ce n'est pas vous&nbsp;?
            </Link>
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Code de vérification"
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
            className={cls(styles.button, "mb-8")}
            priority="tertiary"
          >
            Renvoyer le code
          </Button>
        </form>

        <div className={cls(styles.small, "mt-6 mb-6", "text-center")}>
          L'adresse mail n'est plus valable&nbsp;? <button onClick={contact}>Contactez-nous</button>
          {/* TODO:reset styles */}
        </div>

        <Row className="mb-4">
          <Col>
            <Button
              linkProps={{
                href: "https://mail.google.com/mail/u/0/",
              }}
              className={cls(styles.button, "mt-8")}
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
              className={cls(styles.button, "mt-8")}
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
