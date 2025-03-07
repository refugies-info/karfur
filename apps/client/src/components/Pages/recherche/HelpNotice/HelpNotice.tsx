import Notice from "@codegouvfr/react-dsfr/Notice";

export const HelpNotice = () => (
  <Notice
    isClosable
    title={
      <>
        Réfugiés.info a été nommé Service numérique à impact national !&nbsp;
        <a
          href="https://beta.gouv.fr/startups/refugies.info#impact"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Découvrir l'impact du projet
        </a>
        .
      </>
    }
  />
);
