import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import CSVReader from "react-csv-reader";
import { CSVLink } from "react-csv";
import Icon from "react-eva-icons";

import "./MapModal.scss";

const csvData = [["Nom", "Ville", "Description", "Latitude", "Longitude"]];

const mapModal = (props) => {
  return (
    <Modal
      isOpen={props.showModal}
      toggle={props.toggleModal}
      className="map-modal"
    >
      <ModalHeader toggle={props.toggleModal}>
        Ajouter des coordonnées
      </ModalHeader>
      <ModalBody>
        <h6>Etape 1 : télécharger le modèle de données</h6>
        <p>
          <i>
            Ce fichier .csv s’ouvre avec Excel, vous n’aurez plus qu’à
            copier-coller les données correspondantes depuis votre  fichier de
            coordonées.
          </i>
        </p>
        <Button color="secondary" className="btn-download">
          <CSVLink filename="Template karfur.csv" data={csvData}>
            <Icon name="download-outline" fill="#3D3D3D" />
            Télécharger le fichier modèle
          </CSVLink>
        </Button>

        <h6>Étape 2 : téléverser le modèle complété</h6>
        <p>
          <i>
            Une fois votre fichier modèle complété, téléversez-le ci-dessous
          </i>
        </p>
        <CSVReader
          cssClass="csv-reader-input"
          onFileLoaded={props.handleFileLoaded}
          onError={props.handleError}
          inputId="ObiWan"
          inputStyle={{ color: "#78E08F" }}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={props.toggleModal}>
          Valider
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default mapModal;
