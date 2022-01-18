import React from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

// import "./ThanksModal.scss";

const thanksModal = (props) => {
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="modal-thanks">
      <ModalHeader toggle={props.toggle}>Disponible prochainement</ModalHeader>
      <ModalBody>
        <Row>
          <Col className="custom-padding">
            <Card className="comment-modal">
              <CardBody>
                <EVAIcon
                  name="bar-chart-outline"
                  fill="#FFFFFF"
                  className="icon-on-top"
                />
                <p>
                  Un ensemble d’indicateurs pour vous montrer combien vos
                  contributions facilite la vie d’autrui
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col className="custom-padding">
            <Card className="comment-modal">
              <CardBody>
                <EVAIcon
                  name="award-outline"
                  fill="#FFFFFF"
                  className="icon-on-top"
                />
                <p>
                  Une sélection de remerciements sur les pages auxquels vous
                  avez contribuer
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col className="custom-padding">
            <Card className="comment-modal">
              <CardBody>
                <EVAIcon
                  name="tv-outline"
                  fill="#FFFFFF"
                  className="icon-on-top"
                />
                <p>Des contenus multimédias présentant des témoignages</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default thanksModal;
