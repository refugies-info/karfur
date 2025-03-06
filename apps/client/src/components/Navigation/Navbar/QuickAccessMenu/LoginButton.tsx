import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
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

  const hasAdminRole = user?.roles?.some((role) => role.nom === RoleName.ADMIN);
  const hasTranslatorRole = user?.roles?.some((role) => role.nom === RoleName.TRAD);
  const hasWriterRole = user?.roles?.some((role) => role.nom === RoleName.CONTRIB);

  let buttonLink = "/backend/user-profile";
  if (hasAdminRole) {
    buttonLink = "/backend/admin";
  } else if (hasTranslatorRole) {
    buttonLink = "/backend/user-translation";
  } else if (hasWriterRole) {
    buttonLink = "/backend/user-dash-contrib";
  }

  return (
    <>
      {user ? (
        <Button
          key="login"
          priority="primary"
          linkProps={{
            href: buttonLink,
            prefetch: false,
            className: styles.forcedPrimaryButton,
          }}
          iconId={hasAdminRole ? "ri-vip-crown-2-fill" : "fr-icon-account-pin-circle-fill"}
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
