import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import Icon from "react-eva-icons";

import { filtres } from "../../../containers/Dispositif/data";

import "./ContributeurModal.scss";

class ContributeurModal extends Component {
  state = {
    structure: "",
    tags: filtres.tags.map((x) => ({ ...x, selected: false })),
  };

  onChange = (e) => this.setState({ structure: e.target.value });

  selectTag = (key) =>
    this.setState((prevState) => ({
      tags: prevState.tags.map((x, i) =>
        i === key ? { ...x, selected: !x.selected } : x
      ),
    }));

  onValidate = () => {
    // let user={...this.props.user}
    // let newUser={
    //   _id: user._id,
    //   selectedLanguages: [...this.shadowSelectedLanguages, ...this.state.langues.filter(x => x.checked && !this.shadowSelectedLanguages.some(y=>y._id === x._id)) ].map(el =>{return { _id: el._id, i18nCode: el.i18nCode, langueCode: el.langueCode, langueFr: el.langueFr, langueLoc: el.langueLoc}})
    // }
    // API.set_user_info(newUser).then(data => {
    //   let userRes=data.data.data;
    //   if(!userRes){return}
    if (this.props.redirect) {
      this.props.history.push("/dispositif");
    } else if (this.props.setUser) {
      this.props.setUser();
    }
    // })
  };

  render() {
    const { t, show, toggle } = this.props;
    const { tags, structure } = this.state;
    return (
      <Modal isOpen={show} toggle={toggle} className="modal-contributeur">
        <ModalHeader toggle={toggle}>C'est parti !</ModalHeader>
        <ModalBody>
          <h3>Quels sont vos thèmes de prédilection ?</h3>
          <Row className="align-items-center themes">
            {tags.map((tag, key) => (
              <Col lg="auto" sm="auto" md="auto" xs="auto" xl key={key}>
                <Button
                  block
                  outline={!tag.selected}
                  color={tag.color}
                  onClick={() => this.selectTag(key)}
                >
                  {t("Tags." + tag.name)}
                </Button>
              </Col>
            ))}
          </Row>
          <h3>Quelle structure représentez-vous ?</h3>
          <Input
            type="text"
            placeholder="Aa"
            value={structure}
            onChange={this.onChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button className="validate-btn" onClick={this.onValidate}>
            <Icon name="award-outline" fill="#3D3D3D" />
            Devenir contributeur
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(ContributeurModal);
