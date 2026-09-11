import { Header } from "@codegouvfr/react-dsfr/Header";

const AuthNavbar = () => {
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
        title: "Accueil - Réfugiés.info",
      }}
      operatorLogo={{
        // Decorative: the service title next to it already reads "Réfugiés.info" (RGAA 1.2).
        alt: "",
        imgUrl: "/images/logo-navbar-ri.svg",
        orientation: "horizontal",
      }}
      serviceTitle="Réfugiés.info"
      serviceTagline="L’information simple et traduite pour les réfugiés et leurs accompagnants"
    />
  );
};

export default AuthNavbar;
