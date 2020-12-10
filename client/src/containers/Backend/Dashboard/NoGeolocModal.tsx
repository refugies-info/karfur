import React from "react";
import { ObjectId } from "mongodb";
import { Modal } from "reactstrap";
import styled from "styled-components";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifsWithoutGeoloc: ObjectId[];
}

const Content = styled.div`
  padding: 24px;
`;

export const NoGeolocModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle}>
    <Content>
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
    </Content>
  </Modal>
);
