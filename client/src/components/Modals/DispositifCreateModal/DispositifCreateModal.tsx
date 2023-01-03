import React, { Component } from "react";
import { Modal } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import styles from "./DispositifCreateModal.module.scss";

interface Props {
  toggle: () => void;
  show: boolean;
  typeContenu: string;
  navigateToCommentContribuer: () => void;
}

interface StateType {
  step: number;
}

const getIFrameSrc = (step: number) => {
  if (step === 1) {
    return "https://www.loom.com/embed/43573b5bd3c349d9abb28c0c61af1a5f?autoplay=true";
  }
  if (step === 2) {
    return "https://www.loom.com/embed/aa6bc53a6ed545cb9ec0196cbb40d5bf?autoplay=true";
  }
  return "https://www.loom.com/embed/a213b540704f4d598c338e50c4f07cdd?autoplay=true";
};

export class DispositifCreateModal extends Component<Props, StateType> {
  state: StateType = { step: 1 };
  changeStep = (next = true) => {
    if (this.state.step === 3 && next) {
      return this.props.toggle();
    }
    return this.setState((pS) => ({ step: pS.step + (next ? 1 : -1) }));
  };

  getButtonText = () => {
    if (this.state.step < 3) return "Suivant " + this.state.step + "/3";
    return "C'est parti !";
  };
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.show !== this.props.show && this.state.step !== 1) {
      this.setState({ step: 1 });
    }
  }
  render() {
    const { step } = this.state;
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <div className={styles.container}>
          <div onClick={this.props.toggle} className={styles.close_icon}>
            <EVAIcon name="close-outline" fill="#3D3D3D" size="large" />
          </div>
          <div className={styles.header_container} style={{ marginBottom: step === 2 ? 33 : 41 }}>
            <h2 className={styles.header}>Nouvelle fiche</h2>
            <div>
              <div className={styles.type_contenu}>{this.props.typeContenu}</div>
            </div>
          </div>
          {step === 1 && <p className={styles.subtitle}>Bienvenue dans l&apos;éditeur de fiche dispositif !</p>}

          {step === 3 && <p className={styles.subtitle}>Sauvegardez à tout moment pour finir plus tard</p>}
          {step === 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <p className={styles.subtitle}>
                Cliquez sur les zones surlignées en <span className={styles.yellow}>jaune</span> pour écrire.
              </p>
            </div>
          )}
          <div className={styles.video} style={{ marginTop: step === 2 ? 32 : 40 }}>
            <iframe
              src={getIFrameSrc(this.state.step)}
              frameBorder="0"
              style={{
                top: "0",
                left: " 0",
                width: "100%",
                height: "100%",
                borderRadius: "12px"
              }}
            ></iframe>
          </div>
          <div className={styles.btn_container}>
            <FButton
              type="outline-black"
              name="log-out-outline"
              onClick={() => {
                this.props.toggle();
                this.props.navigateToCommentContribuer();
              }}
            >
              Quitter l&apos;éditeur
            </FButton>
            <div>
              {step > 1 && (
                <FButton
                  type="outline-black"
                  name="arrow-back"
                  onClick={() => this.changeStep(false)}
                  className="me-2"
                />
              )}
              <FButton
                type="validate"
                name={step < 3 ? "arrow-forward" : "checkmark-outline"}
                onClick={this.changeStep}
              >
                {this.getButtonText()}
              </FButton>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
