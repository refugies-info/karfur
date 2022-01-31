import React, { Component } from "react";
import { Modal } from "reactstrap";
import FButton from "components/FigmaUI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import ReactToPrint from "react-to-print";
import styles from "./PdfCreateModal.module.scss";

interface Props {
  toggle: () => void;
  show: boolean;
  t: (a: string, b: string) => string;
  createPdf: () => void;
  printPdf: () => void;
  closePdf: () => void;
  newRef: any;
}

const getIFrameSrc = () => {
  return "https://www.loom.com/embed/b3493cec4f8f4ac3b59b11adabeb244a";
};

export class PdfCreateModal extends Component<Props> {
  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <div className={styles.container}>
          <div onClick={this.props.toggle} className={styles.icon}>
            <EVAIcon name="close-outline" fill="#3D3D3D" size="large" />
          </div>
          <div className={styles.header}>
            <h2>
              {this.props.t(
                "Dispositif.Télécharger la fiche en PDF",
                "Télécharger la fiche en PDF"
              )}
            </h2>
          </div>

          <p className={styles.subtitle}>
            {this.props.t(
              "Dispositif.Enregistrez la fiche depuis la fenêtre d’impression de votre navigateur",
              "Enregistrez la fiche depuis la fenêtre d’impression de votre navigateur."
            )}
          </p>

          <div className={styles.video}>
            <iframe
              src={getIFrameSrc()}
              frameBorder="0"
              allowFullScreen={true}
              style={{
                top: "0",
                left: " 0",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            ></iframe>
          </div>
          <div className={styles.btn_container}>
            <FButton
              type="white"
              className="mr-10"
              name="close-outline"
              onClick={() => {
                this.props.toggle();
              }}
            >
              <div></div>
              {this.props.t("Annuler", "Annuler")}
            </FButton>
            <ReactToPrint
              onBeforeGetContent={async () => {
                await this.props.createPdf();
                await this.props.toggle();
              }}
              onAfterPrint={() => {
                this.props.closePdf();
              }}
              copyStyles
              fonts={[
                {
                  family: "CircularStdMedium",
                  source:
                    "/fonts/CircularStd/CircularStd-Medium.WOFF",
                },
              ]}
              trigger={() => (
                <FButton
                  type="validate"
                  name="download-outline"
                  onClick={() => {
                    this.props.toggle();
                    this.props.printPdf();
                  }}
                >
                  <div></div>
                  {this.props.t("Dispositif.Télécharger", "Télécharger")}
                </FButton>
              )}
              content={() => this.props.newRef.current}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
