import { ReactElement, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { useLogin } from "hooks";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import API from "utils/API";
import Layout from "components/Pages/auth/Layout";
import FRLink from "components/UI/FRLink";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const { logUser } = useLogin();
  const email: string = useMemo(() => router.query.email as string, [router.query]);
  const has2FA = useMemo(() => router.query["2fa"], [router.query]);
  const [error, setError] = useState("");

  const submit = useCallback(
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
        const errorCode = e.response?.data?.code;
        if (errorCode === "NO_CODE_SUPPLIED") {
          router.push(getPath("/auth/code-securite", "fr", `?email=${email}`));
        } else if (errorCode === "INVALID_PASSWORD") {
          setError("Mot de passe incorrect. Réessayez ou cliquez sur 'Mot de passe oublié' pour le réinitialiser.");
        } else if (errorCode === "USER_DELETED") {
          setError("Cet utilisateur n'existe pas ou a été supprimé. Veuillez créer un nouveau compte.");
        } else {
          setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
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
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Ravis de vous revoir&nbsp;!</h1>

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
            messagesHint=""
            nativeInputProps={{ name: "password", autoFocus: true }}
          />
          <div className="mt-2 mb-14">
            <FRLink href={`/auth/reinitialiser-mot-de-passe?email=${email}`}>Mot de passe oublié&nbsp;?</FRLink>
          </div>

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={styles.button}
            nativeButtonProps={{ type: "submit" }}
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
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
