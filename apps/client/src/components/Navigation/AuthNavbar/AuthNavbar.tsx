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
        href: "#",
        title: "Se connecter - Réfugiés.info",
      }}
      operatorLogo={{
        alt: "Réfugiés.info",
        imgUrl: "/images/logo-navbar-ri.svg",
        orientation: "horizontal",
      }}
      serviceTitle="Réfugiés.info"
      serviceTagline="L’information simple et traduite pour les réfugiés et leurs accompagnants"
    />
  );
};

export default AuthNavbar;
