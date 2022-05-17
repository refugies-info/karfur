import React from "react";
import { Modal, Spinner, Row, Col } from "reactstrap";
import styles from "./DetailsModal.module.scss";

interface Props {
  isLoading: boolean;
  show: boolean;
  toggleModal: () => void;
  leftHead: any
  rightHead: any
  children: any
}

export const DetailsModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size="xl"
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      {props.isLoading ? <Spinner /> :
        <>
          <Row>
            <Col className={styles.title}>
              {props.leftHead}
            </Col>

            <Col className="text-right">
              {props.rightHead}
            </Col>
          </Row>
          {props.children}
        </>
      }
    </Modal>
  );
};
