import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import {filtres} from '../../../containers/Dispositif/data';
import {randomColor} from '../../Functions/ColorFunctions';

import './ContributeurModal.scss'

class ContributeurModal extends Component {
  state={
    structure:'',
    tags: filtres.tags.map(x => ({name: x, color: randomColor(), selected: false}))
  }

  onChange = (e) => this.setState({structure: e.target.value})

  selectTag = key => this.setState(prevState => ({tags: prevState.tags.map((x,i) => i===key ? {...x, selected: !x.selected} : x)}))

  render() {
    const {t, show, toggle, name} = this.props;
    const {tags, structure} = this.state;
    return (
      <Modal isOpen={show} toggle={toggle} className='modal-contributeur'>
        <ModalHeader>
          C'est parti !
        </ModalHeader>
        <ModalBody>
          <h3>Quels sont vos thèmes de prédilection ?</h3>
          <Row className="align-items-center themes">
            {tags.map((tag, key) =>(
              <Col col="6" sm="4" md="2" xl key={key}>
                <Button block outline={!tag.selected} color={tag.color} onClick={()=>this.selectTag(key)}>
                  {t("Tags." + tag.name)}
                </Button>
              </Col>
            ))}
          </Row>
          <h3>Quelle structure représentez-vous ?</h3>
          <Input type="text" placeholder="Aa" value={structure} onChange={this.onChange} />
        </ModalBody>
        <ModalFooter>
          <NavLink to="/dispositif" className="no-decoration">
            <Button className="validate-btn">
              <Icon name="award-outline" fill="#3D3D3D" />
              Devenir contributeur
            </Button>
          </NavLink>
        </ModalFooter>
      </Modal>
    )
  }
}

export default withTranslation()(ContributeurModal);