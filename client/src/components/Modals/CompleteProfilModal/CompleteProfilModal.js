import React, { Component } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import FInput from "../../FigmaUI/FInput/FInput";

import "./CompleteProfilModal.scss";

const TitleContainer = styled.div`
  font-weight: 700;
  font-size: 40px;
`;
const FInputContainer = styled.div`
  width: 520px; ;
`;

const ExplainationContainer = styled.div`
  width: 520px;
  background-color: #2d9cdb;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  margin-top: 8px;
`;

const ExplainationTitleContainer = styled.p`
  font-weight: 700;
`;

export class CompleteProfilModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  onChange = (e) => {
    this.setState({ email: e.target.value });
  };

  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="profil-modal"
      >
        <TitleContainer>Complétez votre profil</TitleContainer>

        <p>Pour contribuer, vous devez renseigner votre adresse email :</p>
        <FInputContainer>
          <FInput
            id="email"
            value={this.state.email}
            onChange={this.onChange}
            newSize={true}
            autoFocus={false}
            prepend
            prependName="at-outline"
            placeholder="Mon adresse email"
          />
        </FInputContainer>
        <ExplainationContainer>
          <ExplainationTitleContainer>
            Pourquoi nous vous demandons votre email :
          </ExplainationTitleContainer>
          <ul>
            <li>Pour réinitialiser votre mot de passe en cas d’oubli</li>
            <li>
              Pour vous informer en cas d’évolutions sur vos contributions
            </li>
            <li>Pour des raisons de sécurité (en cas de pratiques abusives)</li>
          </ul>
          Nous ne transmetterons jamais votre email à d’autres organisations.
        </ExplainationContainer>
      </Modal>
    );
  }
}
