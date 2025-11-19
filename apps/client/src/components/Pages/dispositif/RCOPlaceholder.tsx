import { Container } from "reactstrap";

const RCOPlaceholder = () => {
  return (
    <Container className="my-5 text-center">
      <h1>Contenu importé du Réseau Carif-Oref (RCO)</h1>
      <p className="lead">Cette fiche provient d'une source externe. Son contenu est disponible en lecture seule.</p>
    </Container>
  );
};

export default RCOPlaceholder;
