import React, {Component} from 'react';
import { Col, Row, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

import './ObjectifsModal.scss'

class ObjectifsModal extends Component {
  state={
    objectifs: [
      {objectifTemps:30, objectifMotsContrib: 300, objectifMots:50, status:'Contributeur ponctuel', selected:false},
      {objectifTemps:60, objectifMotsContrib: 600, objectifMots:100, status:'Contributeur ponctuel', selected:false},
      {objectifTemps:120, objectifMotsContrib: 1200, objectifMots:500, status:'Contributeur ponctuel', selected:false},
      {objectifTemps:300, objectifMotsContrib: 2000, objectifMots:2000, status:'Contributeur ponctuel', selected:false}
    ],
    notifyObjectifs:false,
  }

  toggleActive = key => {this.setState({objectifs : this.state.objectifs.map((x,i) => i===key ? {...x, selected:true} : {...x, selected:false})})}

  handleCheckChange = (ev) => this.setState({ notifyObjectifs: ev.target.checked });

  _validateObjectifs = () => {
    let objectif=this.state.objectifs.find(x=>x.selected);
    let newUser={
      objectifTemps: objectif.objectifTemps, 
      objectifMotsContrib: objectif.objectifMotsContrib, 
      objectifMots: objectif.objectifMots, 
      notifyObjectifs: this.state.notifyObjectifs
    }
    this.props.validateObjectifs(newUser)
  }

  render(){
    let {objectifs, notifyObjectifs} = this.state;
    return(
      <Modal isOpen={this.props.show} toggle={this.props.toggle} className='modal-objectifs'>
        <ModalHeader>
          Quel est votre objectif de contribution hebdomadaire ?
        </ModalHeader>
        <ModalBody>
          <span className="text-small">
            Ces formules vous aident à définir un niveau d’engagement pour vous-même et nous aide à mieux vous comprendre. Vous pouvez modifier vos objectifs à tout moment.
          </span>
          <Row className="obj-row">
            <Col lg="3" className={objectifs[0].selected ? "active" : ""} onClick={()=>this.toggleActive(0)}>
              <h3>Je n’ai pas beaucoup de temps...</h3>
              <span className="statut">Je n’ai pas beaucoup de temps...</span>
              <div className="detail">
                <div><b>30</b><span className="text-dark"> minutes</span></div>
                <div><b>300</b><span className="text-dark"> mots</span></div>
                <div><b>50</b><span className="text-dark"> mots traduits</span></div>
              </div>
            </Col>
            <Col lg="3" className={objectifs[1].selected ? "active" : ""} onClick={()=>this.toggleActive(1)}>
              <h3>J’ai un peu de temps</h3>
              <span className="statut">Contributeur régulier</span>
              <div className="detail">
                <div><b>60</b><span className="text-dark"> minutes</span></div>
                <div><b>600</b><span className="text-dark"> mots</span></div>
                <div><b>100</b><span className="text-dark"> mots traduits</span></div>
              </div>
            </Col>
            <Col lg="3" className={objectifs[2].selected ? "active" : ""} onClick={()=>this.toggleActive(2)}>
              <h3>J’ai du temps à vous accorder</h3>
              <span className="statut">Grand contributeur</span>
              <div className="detail">
                <div><b>120</b><span className="text-dark"> minutes</span></div>
                <div><b>1200</b><span className="text-dark"> mots</span></div>
                <div><b>500</b><span className="text-dark"> mots traduits</span></div>
              </div>
            </Col>
            <Col lg="3" className={objectifs[3].selected ? "active" : ""} onClick={()=>this.toggleActive(3)}>
              <h3>Ce projet est génial</h3>
              <span className="statut">Ambassadeur céleste</span>
              <div className="detail">
                <div><b>300</b><span className="text-dark"> minutes</span></div>
                <div><b>2000</b><span className="text-dark"> mots</span></div>
                <div><b>2000</b><span className="text-dark"> mots traduits</span></div>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Label check>
            <Input type="checkbox" checked={notifyObjectifs} onChange={this.handleCheckChange} />{' '}
            Je ne veux pas être notifié par email si je n’atteins pas mes objectifs hebdomadaire.
          </Label>
          <Button disabled={!objectifs.some(x => x.selected)} color="success" className="validate-btn d-flex align-items-center" onClick={this._validateObjectifs}>
            <EVAIcon className="margin-right-8 d-inline-flex" name="checkmark-circle-outline" />
            C’est bon ! J’ai choisi.
          </Button>
        </ModalFooter>
      </Modal>
    )
  }  
}

export default ObjectifsModal;