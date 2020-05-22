import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import FButton from "../../FigmaUI/FButton/FButton";

// import DraggableList from '../../UI/DraggableList/DraggableList';
import API from "../../../utils/API";
import { fetch_user } from "../../../services/actions";

import "./TraducteurModal.scss";

class TraducteurModal extends Component {
  state = {
    langues: [],
    spinner: false,
  };
  shadowSelectedLanguages = [];

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user &&
      nextProps.user.selectedLanguages &&
      nextProps.langues &&
      nextProps.langues.length > 0
    ) {
      let selectedLangues = nextProps.user.selectedLanguages;
      this.setState({
        langues: [...nextProps.langues].map((x) => ({
          ...x,
          checked: selectedLangues.some((y) => y._id === x._id),
        })),
      });
    }
  }

  handleCheck = (e, key) => {
    this.setState((prevState) => ({
      langues: prevState.langues.map((x, i) =>
        i === key ? { ...x, checked: !x.checked } : x
      ),
    }));
  };

  handleDraggableListChange = (value) => {
    let langues_list = [...this.state.langues].filter((x) => x.checked);
    let newOrder = [];
    value.forEach((item) => {
      newOrder.push(langues_list[item]);
    });
    this.shadowSelectedLanguages = newOrder;
  };

  onValidate = () => {
    this.setState({ spinner: true });
    let user = { ...this.props.user };
    let newUser = {
      _id: user._id,
      selectedLanguages: [
        ...this.shadowSelectedLanguages,
        ...this.state.langues.filter(
          (x) =>
            x.checked &&
            !this.shadowSelectedLanguages.some((y) => y._id === x._id)
        ),
      ].map((el) => {
        return {
          _id: el._id,
          i18nCode: el.i18nCode,
          langueCode: el.langueCode,
          langueFr: el.langueFr,
          langueLoc: el.langueLoc,
        };
      }),
      traducteur: true,
    };
    API.set_user_info(newUser).then((data) => {
      let userRes = data.data.data;
      if (!userRes) {
        return;
      }
      this.props.fetch_user().then(() => {
        this.setState({ spinner: false });
        if (this.props.redirect) {
          this.props.history.push({
            pathname: "/backend/user-dashboard",
            state: { user: userRes },
          });
        } else if (this.props.setUser) {
          this.props.setUser(userRes);
        }
      });
    });
  };

  render() {
    const { show, toggle } = this.props;
    const { langues } = this.state;
    // let langues_list = langues.filter(x => x.checked).map(x => x.langueFr);

    return (
      <Modal isOpen={show} toggle={toggle} className="modal-traducteur">
        <ModalHeader toggle={toggle}>C'est parti !</ModalHeader>
        <ModalBody>
          <h5>Quelles sont vos langues de travail ?</h5>
          <FormGroup row>
            {(langues || []).map((langue, key) => (
              <Col lg="3" key={key}>
                <FormGroup check>
                  <Input
                    className="form-check-input langue"
                    type="checkbox"
                    id={langue._id}
                    checked={langue.checked}
                    onChange={(e) => this.handleCheck(e, key)}
                  />
                  <Label
                    check
                    className="form-check-label"
                    htmlFor={langue._id}
                  >
                    {langue.langueFr}
                  </Label>
                </FormGroup>
              </Col>
            ))}
          </FormGroup>

          {/* {langues_list.length>0 && 
            <>
              <h3>Veuillez prioriser vos langues de travail</h3>
              <FormGroup>
                <DraggableList 
                  items={langues_list}
                  maxLength={langues.length}
                  handleDraggableListChange={this.handleDraggableListChange}
                  />
              </FormGroup>
            </>} */}
        </ModalBody>
        <ModalFooter>
          <FButton className="validate hero" onClick={this.onValidate}>
            {this.props.setUser ? "Valider" : "Devenir traducteur"}
            {this.state.spinner && <Spinner color="success" className="ml-2" />}
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  };
};

const mapDispatchToProps = { fetch_user };

export default withRouter(
  withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(TraducteurModal)
  )
);
