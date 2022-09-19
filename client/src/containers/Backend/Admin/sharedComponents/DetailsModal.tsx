import React from "react";
import { Modal, Spinner, Row, Col } from "reactstrap";
import { cls } from "lib/classname";
import styles from "./DetailsModal.module.scss";

interface Props {
  isLoading: boolean;
  show: boolean;
  toggleModal: () => void;
  leftHead: any
  rightHead: any
  children: any
  className?: string
  contentClassName?: string
  size?: "xl" | "lg"
}

export const DetailsModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size={props.size || "xl"}
      className={cls(
        styles.modal,
        !props.size || props.size === "xl" ? styles.xl : "",
        props.className || ""
      )}
      contentClassName={cls(styles.modal_content, props.contentClassName || "")}
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
