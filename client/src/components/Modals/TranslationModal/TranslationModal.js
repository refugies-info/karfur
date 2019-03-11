import React, {Component} from 'react';
import { Row, Col, Button, FormGroup, FormFeedback, Input, Label } from 'reactstrap';

import './TranslationModal.css';
import Modal from '../Modal'

class TranslationModal extends Component {
  render () {
    return (
      <Modal 
        show={this.props.show} 
        classe="translation-modal text-center">

        <FormGroup>
          <Label htmlFor="initialText">Texte initial en français</Label>
          <div
            type="text" 
            className="form-control form-control-success" 
            id="initialText">
            {this.props.initial_string}
          </div>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="translationInput">Traduction</Label>
          <Input 
            type="textarea" 
            rows="2"
            invalid = {this.props.translated_string ===''}
            valid = {this.props.translated_string !==''}
            id="translationInput"
            placeholder="Nouvelle traduction..."
            value={this.props.translated_string} 
            onChange={this.props.handleTranslationChange} />
          <FormFeedback className="help-block">Merci de fournir une traduction</FormFeedback>
        </FormGroup>

        <span className="change">Cliquez sur le bouton ci-dessous pour le voir en contexte</span>

        <Row className="align-items-center">
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button block outline color="success" 
              className="btn-pill"
              onClick={this.props.clicked}>
              Suggérer cette traduction
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default TranslationModal;