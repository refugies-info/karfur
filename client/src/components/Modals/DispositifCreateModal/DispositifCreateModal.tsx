import React, { Component } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
// import Icon from "react-eva-icons";
// import "./DispositifCreateModal.scss";
import FButton from "../../FigmaUI/FButton/FButton";

interface Props {
  toggle: () => void;
  show: boolean;
  typeContenu: string;
  navigateToCommentContribuer: () => void;
}
const IconContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
`;

const MainContainer = styled.div`
  padding: 40px;
  border-radius: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TypeContenuContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 8px 16px;
  margin-left: 13px;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  color: #5e5e5e;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => (props.step === 2 ? "33px" : "41px")};
`;

const Subtitle = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
`;

const VideoContainer = styled.div`
  background: #d2edfc;
  border-radius: 12px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:  ${(props) => (props.step === 2 ? "32px" : "40px")}
  margin-bottom: 82px;
`;
const YellowText = styled.div`
  background: #f9ef99;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  padding: 8px;
  margin-left: 8px;
  margin-right: 8px;
  color: #3a3a3a;
`;
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
        className="dispo-create"
      >
        <MainContainer>
          <IconContainer onClick={this.props.toggle}>
            {/* <Icon name="close-outline" fill="#3D3D3D" size="large" /> */}
          </IconContainer>
          <HeaderContainer step={this.state.step}>
            <Header>Nouvelle fiche</Header>
            <div>
              <TypeContenuContainer>
                {this.props.typeContenu}
              </TypeContenuContainer>
            </div>
          </HeaderContainer>
          {step === 1 && (
            <Subtitle>Bienvenue dans l'éditeur de fiche dispositif !</Subtitle>
          )}

          {step === 3 && (
            <Subtitle>Sauvegardez à tout moment pour finir plus tard</Subtitle>
          )}
          {step === 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Subtitle>Cliquez sur les zones surlignées en </Subtitle>
              <YellowText>jaune</YellowText>
              <Subtitle>pour écrire.</Subtitle>
            </div>
          )}
          <VideoContainer step={this.state.step}>
            <iframe
              src={getIFrameSrc(this.state.step)}
              frameBorder="0"
              style={{
                top: "0",
                left: " 0",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            ></iframe>
          </VideoContainer>
          <ButtonsContainer>
            <FButton
              type="outline-black"
              name="log-out-outline"
              onClick={() => {
                this.props.toggle();
                this.props.navigateToCommentContribuer();
              }}
            >
              Quitter l'éditeur
            </FButton>
            <div>
              {step > 1 && (
                <FButton
                  type="outline-black"
                  name="arrow-back"
                  onClick={() => this.changeStep(false)}
                  className="mr-10"
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
          </ButtonsContainer>
        </MainContainer>
      </Modal>
    );
  }
}
