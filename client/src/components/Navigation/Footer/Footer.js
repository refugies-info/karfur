import React from 'react';

import './Footer.css';
import Logo from '../../Logo/Logo';

const footer = ( props ) => (
    <footer className="Footer">
        <div className="Logo">
            <a href="/">
                <Logo />
            </a>
        </div>
        <span className="ml-auto">Créé par <a href="https://accueil-integration-refugies.fr">la Direction Interministérielle pour l'Accueil et l'Intégration des Réfugiés (DiAiR)</a></span>
    </footer>
);

export default footer;