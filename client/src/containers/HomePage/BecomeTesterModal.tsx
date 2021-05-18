import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { colors } from "../../colors";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
}

const MainContainer = styled.div`
  text-align: center;
`;

const CloseIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${colors.noir};
  right: 10px;
  top: 8px;
  cursor: pointer;
`;

export const BecomeTesterModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle} className="share-content">
    <MainContainer>
      <CloseIconContainer onClick={props.toggle}>
        <EVAIcon name="close" fill={colors.blancSimple} size={"large"} />
      </CloseIconContainer>
      <iframe
        style={{
          alignSelf: "center",
          width: "100%",
          height: 900,
          border: "1px solid #FBFBFB",
          borderRadius: "12px",
        }}
        allowFullScreen
        src="https://airtable.com/embed/shrnxkFB2Pa9Awzgs?backgroundColor=yellow"
      />
    </MainContainer>
  </Modal>
);
