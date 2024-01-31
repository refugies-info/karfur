import React, { useCallback, useMemo, useState } from "react";
import { Col, Row } from "reactstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useLogin } from "hooks";
import { logger } from "logger";
import API from "utils/API";
import { cls } from "lib/classname";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import GmailIcon from "assets/auth/providers/gmail-icon.svg";
import OutlookIcon from "assets/auth/providers/outlook-icon.svg";
import styles from "scss/components/auth.module.scss";

interface Props {
  type: "2fa" | "login";
}

const CheckCode = ({ type }: Props) => {
  const router = useRouter();
  const email = useMemo(() => router.query.email as string, [router.query]);
  const [error, setError] = useState("");
  const { logUser } = useLogin();

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
          setError("Code incorrect, veuillez réessayer.");
        } else {
          logger.error(e);
          setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
      }
    },
    [logUser, email],
  );

  const resendCode = useCallback(
    (e: any) => {
      e.preventDefault();
      API.sendCode({ email });
    },
    [email],
  );

  const contact = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  if (!email) return null;

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Code de sécurité" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          {type === "2fa" ? <h1>Vérifions que c’est bien vous&nbsp;!</h1> : <h1>Entrez le code reçu</h1>}
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
            label={type === "2fa" ? "Code de vérification" : "Code de connexion temporaire"}
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
            onClick={resendCode}
            className={styles.button}
            priority="tertiary"
          >
            Renvoyer le code
          </Button>
        </form>

        {type === "2fa" && (
          <div className={cls(styles.small, "mt-14 mb-14", "text-center")}>
            L'adresse mail n'est plus valable&nbsp;?{" "}
            <button onClick={contact} className={styles.link}>
              Contactez-nous
            </button>
          </div>
        )}

        <Row className={cls("mb-4", type !== "2fa" && styles.space_top)}>
          <Col>
            <Button
              linkProps={{
                href: "https://mail.google.com/mail/u/0/",
              }}
              className={styles.button}
              priority="tertiary"
            >
              <Image src={GmailIcon} width={24} height={24} alt="" className="me-2" />
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
              <Image src={OutlookIcon} width={24} height={24} alt="" className="me-2" />
              Ouvrir Outlook
            </Button>
          </Col>
        </Row>
        <p className={cls(styles.small, "mt-6", "text-center")}>Pensez à vérifiez votre courrier indésirable&nbsp;!</p>
      </div>
    </div>
  );
};

export default CheckCode;
