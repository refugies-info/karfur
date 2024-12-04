import Notice from "@codegouvfr/react-dsfr/Notice";

export const HelpNotice = () => (
  <Notice
    isClosable
    title={
      <>
        Bienvenue sur la nouvelle page de recherche d'information Réfugiés.info&nbsp;! Découvrez toutes les nouveautés
        dans{" "}
        <a
          href="https://help.refugies.info/fr/article/decouvrez-la-nouvelle-page-de-recherche-dinformation-16pz0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-underline"
        >
          notre article d'aide
        </a>
        .
      </>
    }
  />
);
