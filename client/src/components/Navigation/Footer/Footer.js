import React from 'react';
import { Button, Col} from 'reactstrap';

import './Footer.css';
import Logo from '../../Logo/Logo';

const footer = ( props ) => (
  <footer className="Footer my-first-step">
    <div className="Logo">
      <Logo />
    </div>
    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
      <Button 
        color="light"
        onClick={props.devenirTraducteur}>
        Je veux devenir traducteur
      </Button>
    </Col>
    <span className="ml-auto">Créé par <a href="https://accueil-integration-refugies.fr">la Direction Interministérielle pour l'Accueil et l'Intégration des Réfugiés (DiAiR)</a></span>
  </footer>
);

export default footer;