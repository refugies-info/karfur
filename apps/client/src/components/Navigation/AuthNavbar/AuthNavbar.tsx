import { Header } from "@codegouvfr/react-dsfr/Header";
import { useTranslation } from "next-i18next";

const AuthNavbar = () => {
  const { t } = useTranslation();
  const serviceName = t("Header.serviceName", "Vivre en France");

  return (
    <Header
      brandTop={
        <>
          RÉPUBLIQUE
          <br />
          FRANÇAISE
        </>
      }
      homeLinkProps={{
        href: "/",
        title: `Accueil - ${serviceName}`,
      }}
      operatorLogo={{
        // Decorative: the service title next to it already reads the service name (RGAA 1.2).
        alt: "",
        imgUrl: "/images/logo-navbar-ri.svg",
        orientation: "horizontal",
      }}
      serviceTitle={serviceName}
      serviceTagline={t("Header.serviceTagline", "S’informer, s’orienter et s’intégrer en France")}
    />
  );
};

export default AuthNavbar;
