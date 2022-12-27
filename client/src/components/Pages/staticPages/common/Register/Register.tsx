import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/legacy/image";
import { useTranslation } from "next-i18next";
import qs from "query-string";
import { getPath } from "routes";
import { cls } from "lib/classname";
import { userDetailsSelector } from "services/User/user.selectors";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton";
import Checkbox from "components/UI/Checkbox";
import { ReceiveInvitationMailModal } from "components/Modals";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./Register.module.scss";
import useWindowSize from "hooks/useWindowSize";
import MobileRegisterImg from "assets/staticPages/publier/mobile-register.png";

interface Props {
  subtitleForm: string;
  subtitleLoggedIn: string;
  btnLoggedIn: string;
  onClickLoggedIn: () => void;
  subtitleMobile: string;
}

const Register = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();

  const [showInvitationEmailModal, setShowInvitationEmailModal] = useState(false);
  const toggleShowInvitationEmailModal = useCallback(() => {
    setShowInvitationEmailModal((o) => !o);
  }, []);

  const [username, setUsername] = useState("");
  const [acceptConditions, setAcceptConditions] = useState(false);
  const isLoggedIn = !!useSelector(userDetailsSelector);

  const onSubmit = () => {
    router.push({
      pathname: getPath("/register", router.locale),
      search: qs.stringify({ username: username })
    });
  };

  const title = useMemo(
    () => <h2 className={cls(commonStyles.title2, "text-center", "mb-0")}>{t("StaticPages.registerTitle")}</h2>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Container className={cls(styles.register, isLoggedIn && styles.logged_in)}>
      {isTablet ? (
        <>
          <div className={styles.image}>
            <Image src={MobileRegisterImg} alt="Mockup of refugies.info" width={200} height={200} />
          </div>
          {title}
          <p className={cls(commonStyles.subtitle)}>{props.subtitleMobile}</p>
          <FButton type="login" name="email-outline" className={styles.btn} onClick={toggleShowInvitationEmailModal}>
            {t("StaticPages.registerMobileCTA")}
          </FButton>

          <ReceiveInvitationMailModal
            toggle={toggleShowInvitationEmailModal}
            show={showInvitationEmailModal}
            togglePreviousModal={() => {}}
          />
        </>
      ) : (
        <>
          {title}
          <p className={cls(commonStyles.subtitle)}>{isLoggedIn ? props.subtitleLoggedIn : props.subtitleForm}</p>
          {isLoggedIn ? (
            <>
              <FButton
                type="login"
                name="plus-circle-outline"
                className={styles.write_btn}
                onClick={props.onClickLoggedIn}
              >
                {props.btnLoggedIn}
              </FButton>
            </>
          ) : (
            <>
              <div className={cls(styles.conditions)}>
                <Checkbox
                  id="register-conditions"
                  className={styles.checkbox}
                  checked={acceptConditions}
                  onChange={() => setAcceptConditions((a) => !a)}
                >
                  {t("StaticPages.registerConditions")}
                </Checkbox>
              </div>

              <FInput
                prepend
                prependName="person-outline"
                id="username"
                type="text"
                placeholder={t("Login.Pseudonyme", "Pseudonyme")}
                newSize
                onChange={(e: any) => setUsername(e.target.value)}
                className={styles.input}
                autoFocus={false}
              />
              <FButton
                type="login"
                name="log-in-outline"
                className={styles.btn}
                disabled={!acceptConditions || !username}
                onClick={onSubmit}
              >
                {t("StaticPages.registerCTA")}
              </FButton>

              <p className={styles.login}>
                {t("Register.Déjà un compte ?")}
                <Link legacyBehavior href={getPath("/login", router.locale)}>
                  <a className={styles.link}>{t("Register.Se connecter")}</a>
                </Link>
              </p>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Register;
