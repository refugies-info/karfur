import React, { Component } from "react";
import { withTranslation } from "react-i18next";

import "./MentionsLegales.scss";

class MentionsLegales extends Component {
  state = {};

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="animated fadeIn mentions-legales texte-small">
        <h1>Mentions légales</h1>
        <h2>Site édité par</h2>
        <strong>Refugies.info</strong>
        <p>Place Beauvau 75800 Paris Cedex 08</p>

        <h2>Directeur de la publication</h2>

        <strong>Nour Allazkani</strong>

        <h2>Droit d’accès</h2>

        <p>
          En application de la loi Informatique et liberté, vous disposez d’un
          droit d’accès, de rectification, de modification et de suppression
          concernant des données qui vous concernent personnellement. Ce droit
          peut être exercé par voie électronique à l’adresse email suivante :{" "}
          <a title="Email" href="mailto:nour@refugies.info">
            nour@refugies.info
          </a>
          .
          <p>
            Ou par courrier postal, daté et signé, accompagné d'une copie d’un
            titre d’identité, à l'adresse suivante :
          </p>
          <p>
            <strong>
              Le délégué interministériel chargé de l'accueil et de
              l'intégration des réfugiés
            </strong>
            <br />
            18 rue des Pyrénées
            <br />
            75020 Paris
          </p>
        </p>

        <h2>Politique de confidentialité</h2>

        <p>
          Les informations personnelles collectées ne sont en aucun cas confiées
          à des tiers. Pour plus d'information consultez la page relative à{" "}
          <a href="/politique-de-confidentialite/">
            <strong>notre politique de confidentialité</strong>
          </a>
          .
        </p>

        <h2>Propriété intellectuelle</h2>

        <p>
          Tout le contenu de notre site, incluant, de façon non limitative, les
          graphismes, images, textes, vidéos, animations, sons, logos et icônes,
          sont la propriété exclusive de l'éditeur du site, à l’exception des
          marques, logos ou contenus appartenant à d’autres organisations. Pour
          toute demande d’autorisation ou d’information, veuillez nous contacter
          par email :{" "}
          <a title="Email" href="mailto:nour@refugies.info">
            nour@refugies.info
          </a>
          . Des conditions spécifiques sont prévues pour la presse.
        </p>

        <h2>Hébergeur</h2>

        <p>
          Le site Refugies.info est hébergé par la société
          <a href="https://www.ovh.com">OVH</a>. 2 rue Kellermann – 59100
          Roubaix – France Téléphone : 08 90 39 09 75 (France)
        </p>
      </div>
    );
  }
}

export default withTranslation()(MentionsLegales);
