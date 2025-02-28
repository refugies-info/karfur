import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";
import { getPath } from "~/routes";
import { userSelector } from "~/services/User/user.selectors";
import styles from "./LoginButton.module.scss";

const LoginButton = () => {
  const { user } = useSelector(userSelector);
  const { t } = useTranslation();

  return (
    <>
      {user ? (
        <Button
          key="login"
          priority="primary"
          linkProps={{
            href: "/backend/user-profile",
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
