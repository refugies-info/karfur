import { ReactElement, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { getPath } from "routes";
import { useLogin } from "hooks";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import FRLink from "components/UI/FRLink";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const { logUser, handleError } = useLogin();
  const email: string = useMemo(() => router.query.email as string, [router.query]);
  const has2FA = useMemo(() => router.query["2fa"], [router.query]);
  const [error, setError] = useState("");

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      const password = e.target.password.value;
      try {
        const res = await API.login({
          authPassword: { email, password },
        });
        if (!res.token) throw new Error();
        logUser(res.token);
      } catch (e: any) {
        const error = handleError(e.response?.data?.code, e.response?.data?.data?.email || "");
        if (error) setError(error);
      }
    },
    [router, email, logUser],
  );

  // TODO: if auth -> redirect
  if (!email) return null;

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Ravis de vous revoir !" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.title}>
        <h1>Ravis de vous revoir&nbsp;!</h1>
        <Tag className={styles.tag}>{email}</Tag>
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
          messagesHint=""
          nativeInputProps={{ name: "password", autoFocus: true }}
        />
        <div className={cls("mt-2", styles.mb)}>
          <FRLink href={`/auth/reinitialiser-mot-de-passe?email=${email}`}>Mot de passe oublié&nbsp;?</FRLink>
        </div>

        <Button
          iconId="fr-icon-arrow-right-line"
          iconPosition="right"
          className={styles.button}
          nativeButtonProps={{ type: "submit" }}
          disabled={loading}
        >
          {!has2FA ? "Me connecter" : "Me connecter avec le mot de passe"}
        </Button>
      </form>

      {!has2FA && (
        <>
          <div className={styles.separator}>
            <span>ou</span>
          </div>

          <Button
            linkProps={{ href: getPath("/auth/code-connexion", "fr", `?email=${email}`) }}
            className={styles.button}
            priority="tertiary"
          >
            Me connecter avec un code reçu par mail
          </Button>
        </>
      )}
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
