import React from "react";
import { Modal } from "reactstrap";
import styles from "./NoGeolocModal.module.scss";
import { Id } from "@refugies-info/api-types";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifsWithoutGeoloc: Id[];
}

export const NoGeolocModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle}>
    <div className={styles.content}>
      <b>Dispositifs sans geolocalisation :</b>
      {props.dispositifsWithoutGeoloc &&
        props.dispositifsWithoutGeoloc.map((dispoId) => {
          const url = `/dispositif/${dispoId}`;
          return (
            <li key={dispoId.toString()}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <u>{url}</u>
              </a>
            </li>
          );
        })}
    </div>
  </Modal>
);
