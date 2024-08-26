import NoIcon from "@/assets/dispositif/no-icon.svg";
import YesIcon from "@/assets/dispositif/yes-icon.svg";
import React from "react";
import { Col, Row } from "reactstrap";
import ChoiceButton from "../../../ChoiceButton";

interface Props {
  memberOfStructure: boolean | null;
  setMemberOfStructure: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const MemberOfStructure = (props: Props) => {
  return (
    <div>
      <p>
        Cochez oui si vous travaillez dans cette structure. Si vous avez rédigé cette fiche de votre propre initiative
        ou par solidarité, cochez non.
      </p>
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
