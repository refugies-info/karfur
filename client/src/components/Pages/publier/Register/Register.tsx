import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import qs from "query-string";
import { getPath } from "routes";
import { cls } from "lib/classname";
import { userDetailsSelector } from "services/User/user.selectors";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton";
import Checkbox from "components/UI/Checkbox";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./Register.module.scss";
import useWindowSize from "hooks/useWindowSize";
import MobileRegisterImg from "assets/publier/mobile-register.png";

interface Props {}

const Register = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();

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
    () => <h2 className={cls(commonStyles.title2, "text-center", "mb-0")}>{t("Publish.registerTitle")}</h2>,
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
          <p className={cls(commonStyles.subtitle)}>{t("Publish.registerMobile")}</p>
          <FButton type="login" name="email-outline" className={styles.btn}>
            {t("Publish.registerMobileCTA")}
          </FButton>
        </>
      ) : (
        <>
          {title}
          <p className={cls(commonStyles.subtitle)}>
            {isLoggedIn ? t("Publish.registerLoggedIn") : t("Publish.registerSubtitle")}
          </p>
          {isLoggedIn ? (
            <>
              <Link href="#" passHref>
                <FButton type="login" name="plus-circle-outline" className={styles.write_btn} tag="a">
                  {t("Publish.navbarItem5")}
                </FButton>
              </Link>
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
                  {t("Publish.registerConditions")}
                </Checkbox>
              </div>

              <FInput
                prepend
                prependName="person-outline"
                id="username"
                type="text"
                placeholder={t("Login.Pseudonyme", "Pseudonyme")}
                autoComplete="username"
                newSize
                onChange={(e: any) => setUsername(e.target.value)}
                className={styles.input}
              />
              <FButton
                type="login"
                name="log-in-outline"
                className={styles.btn}
                disabled={!acceptConditions || !username}
                onClick={onSubmit}
              >
                {t("Publish.registerCTA")}
              </FButton>

              <p className={styles.login}>
                {t("Register.Déjà un compte ?")}
                <Link href={getPath("/login", router.locale)}>
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
