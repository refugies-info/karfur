import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import FRLink from "components/UI/FRLink";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const email = useMemo(() => router.query.email, [router.query]);
  const [error, setError] = useState("");

  const submit = useCallback(
    (e: any) => {
      e.preventDefault();
      const password = e.target.password.value;
      // TODO: send and check password
      const isPasswordOk = true;
      if (isPasswordOk) {
        // TODO: check role
        router.push(`/auth/login-code?email=${email}`);
      } else {
        setError("Mot de passe invalide.");
      }
    },
    [router, email],
  );

  const sendEmailCode = useCallback(() => {
    // TODO: send email code and then
    router.push(`/auth/security-code?email=${email}`);
  }, [router, email]);

  if (!email) return null;

  return (
    <div>
      <SEO title="Bienvenue" />
      <div>
        <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
          Retour
        </Button>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>Ravis de vous revoir !</h1>

            <Tag className={cls("mb-5", styles.tag)}>{email}</Tag>
          </div>

          <form onSubmit={submit}>
            <PasswordInput
              label="Mot de passe"
              messages={
                !!error
                  ? [
                      {
                        message: error,
                        severity: "error",
                      },
                    ]
                  : []
              }
              nativeInputProps={{ name: "password", autoFocus: true }}
            />
            <div className="mb-6">
              <FRLink href="/auth/reset-password">Mot de passe oublié&nbsp;?</FRLink>
            </div>

            <Button
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              className={cls(styles.button, "mt-8")}
              nativeButtonProps={{ type: "submit" }}
            >
              Me connecter
            </Button>
          </form>

          <div className={styles.separator}>
            <span>ou</span>
          </div>

          <Button onClick={sendEmailCode} className={styles.button} priority="tertiary">
            Me connecter avec un code reçu par mail
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
