import React from "react";
import { Col, Row } from "reactstrap";
import ChoiceButton from "../../../ChoiceButton";
import YesIcon from "assets/dispositif/yes-icon.svg";
import NoIcon from "assets/dispositif/no-icon.svg";
import styles from "./MemberOfStructure.module.scss";

interface Props {
  memberOfStructure: boolean | null;
  setMemberOfStructure: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const MemberOfStructure = (props: Props) => {
  return (
    <div>
      <p>Oui si vous y travaillez, non si vous avez rédigé ça par solidarité / bénévolat.</p>
      <Row>
        <Col>
          <ChoiceButton
            text="Oui"
            type="radio"
            selected={props.memberOfStructure === true}
            onSelect={() => props.setMemberOfStructure(true)}
            image={YesIcon}
          />
        </Col>
        <Col>
          <ChoiceButton
            text="Non"
            type="radio"
            selected={props.memberOfStructure === false}
            onSelect={() => props.setMemberOfStructure(false)}
            image={NoIcon}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MemberOfStructure;
