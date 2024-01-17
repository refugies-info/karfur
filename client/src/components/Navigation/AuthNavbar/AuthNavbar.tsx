import { Header } from "@codegouvfr/react-dsfr/Header";

const AuthNavbar = () => {
  return (
    <Header
      brandTop="GOUVERNEMENT"
      homeLinkProps={{
        href: "/",
        title: "Accueil - Réfugiés.info",
      }}
      operatorLogo={{
        alt: "Réfugiés.info",
        imgUrl: "/images/logoRI.svg",
        orientation: "horizontal",
      }}
    />
  );
};

export default AuthNavbar;
