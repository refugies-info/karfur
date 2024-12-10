import Button from "@codegouvfr/react-dsfr/Button";
import router from "next/router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getPath } from "~/routes";
import { userSelector } from "~/services/User/user.selectors";
import styles from "./LoginButton.module.scss";

const LoginButton = () => {
  const { user } = useSelector(userSelector);
  const { t } = useTranslation();
  // eslint-disable-next-line no-console
  console.log(user);
  return (
    <>
      {user ? (
        <Button
          key="login"
          priority="primary"
          linkProps={{
            // @ts-ignore
            href: getPath("/backend/user-profile", router.locale), // TODO : fix the type route error here
            prefetch: false,
            className: styles.forcedPrimaryButton,
          }}
          iconId="fr-icon-account-pin-circle-line"
        >
          {user.firstName ? user.firstName : t("Header.monEspace", "Mon espace")}
        </Button>
      ) : (
        <Button
          key="login"
          priority="primary"
          linkProps={{
            href: getPath("/auth", router.locale),
            prefetch: false,
          }}
          iconId="fr-icon-account-pin-circle-line"
        >
          {t("Header.logIn", "Se connecter")}
        </Button>
      )}{" "}
    </>
  );
};

LoginButton.displayName = "LoginButton";

export default memo(LoginButton);
