import React from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Icon from "react-eva-icons";
import { withTranslation } from "react-i18next";

import SVGIcon from "../../UI/SVGIcon/SVGIcon";

import "./ReagirModal.scss";

const reagirModal = (props) => {
  const { t } = props;
  const goTo = (newModalName) => {
    props.toggleModal(true, newModalName);
    props.toggleModal(false, props.name);
  };
  return (
    <Modal
      isOpen={props.show}
      toggle={() => props.toggleModal(false, props.name)}
      className="modal-reagir"
    >
      <ModalHeader toggle={() => props.toggleModal(false, props.name)}>
        <Icon name="message-circle" fill="#3D3D3D" />
        {t("Dispositif.Réagir", "Réagir")}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col className="narrow-padding">
            <Card className="comment-modal">
              <CardBody>
                <div className="texte">
                  {t(
                    "Dispositif.Je veux juste vous dire",
                    "Je veux juste vous dire"
                  )}
                  ...
                </div>
                <div className="feedback-buttons">
                  <Button
                    color="dark"
                    onClick={() => props.onValidate(props.name, "merci")}
                  >
                    {t("Merci", "Merci !")}{" "}
                    <span role="img" aria-label="merci">
                      🙏
                    </span>
                  </Button>
                  <Button
                    color="dark"
                    onClick={() => props.onValidate(props.name, "bravo")}
                  >
                    {t("Bravo", "Bravo !")}{" "}
                    <span role="img" aria-label="bravo">
                      😊
                    </span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="narrow-padding">
            <Card
              className="comment-modal pointy-end"
              onClick={() => goTo("suggerer")}
            >
              <CardBody>
                <div className="texte">
                  {t(
                    "Dispositif.J'ai une suggestion !",
                    "J'ai une suggestion !"
                  )}
                </div>
                <div className="icone">
                  <SVGIcon name="idea" alt="idea" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="narrow-padding">
            <Card
              className="comment-modal pointy-end"
              onClick={() => goTo("question")}
            >
              <CardBody>
                <div className="texte">
                  {t("Dispositif.J'ai une question", "J'ai une question")}
                </div>
                <div className="icone">
                  <SVGIcon name="question" alt="question" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(reagirModal);
