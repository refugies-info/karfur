import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import styled from "styled-components";
import TagButton from "../../FigmaUI/TagButton/TagButton";
import Streamline from "../../../assets/streamline";
import { withTranslation } from "react-i18next";
import variables from "scss/colors.scss";

import FButton from "../../FigmaUI/FButton/FButton";

import "./TagsModal.scss";
import { filtres } from "../../../containers/Dispositif/data";

const Title = styled.p`
  align-self: center;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 20;
  color: ${(props) => (props.selected ? "white" : "black")};
`;

const Subtitle = styled.p`
  align-self: center;
  margin-bottom: 0;
  font-size: 15px  !important;
  color: ${(props) => (props.selected ? "white" : "black")};
`;
const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Sphere = styled.div`
 width: 40px;
 height: 40px;
 border-radius: 20px;
 background-color: ${(props) => (props.done ? "#4caf50" : "#443023")};
 margin-right: 10px;
 justify-content: center;
 display: flex;
 align-items: center;
`;

const Step = ({...props}) => {
  return(
  <Sphere done={props.done}>
    <Title selected>
      {props.children}
      </Title>
  </Sphere>
  )
}

const StyledSub = ({ ...props }) => {
  return (
    <div  style={{marginTop: 20, marginBottom: 20, flexDirection: 'row', display: 'flex', alignItems: 'center'}} {...props}>
      <Step done={props.done}>
        {props.step}
      </Step>
      <div>
      <Title>{props.title}</Title>
      <Subtitle>{props.subtitle}</Subtitle>
      </div>
    </div>
  );
};

export class dispositifValidateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag1: null,
      tag2: null,
      tag3: null,
      noTag: false,
      selectedCourseId: null,
    };
  }

  selectTag1 = (subi) => {
    this.setState({ tag1: subi });
    //this.props.selectParam(this.props.keyValue, subi);
    //this.toggle();
  };

  tagCheck = () => {
    if (!this.state.noTag) {
      this.setState({ tag2: null, tag3: null });
    }
    this.setState({ noTag: !this.state.noTag });
  };

  selectTag2 = (subi) => {
    if (this.state.tag2 && subi.short === this.state.tag2.short) {
      this.setState({ tag2: null });
    } else if (this.state.tag3 && subi.short === this.state.tag3.short) {
      this.setState({ tag3: null });
    } else if (
      (this.state.tag2 && this.state.tag3) ||
      (this.state.tag2 && !this.state.tag3)
    ) {
      this.setState({ tag3: subi, noTag: false });
    } else if (!this.state.tag2 && !this.state.tag3) {
      this.setState({ tag2: subi, noTag: false });
    } else if (!this.state.tag2 && this.state.tag3) {
      this.setState({ tag2: subi, noTag: false });
    }
    //this.props.selectParam(this.props.keyValue, subi);
    //this.toggle();
  };

  validateAndClose = () => {
    this.props.validate([this.state.tag1, this.state.tag2, this.state.tag3]);
    this.props.toggle();
  };
  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="dispositif-validate-modal"
      >
        <ModalHeader toggle={this.props.toggle}>Choix des thèmes</ModalHeader>
        <ModalBody>
          <StyledSub
            title={"Choisissez le thème principal de votre fiche"}
            subtitle={
              "Ce thème catégorise votre fiche pour le moteur de recherche"
            }
            step={'1'}
            done={this.state.tag1 ? true : false}
          />
          {this.props.categories.map((subi, idx) => {
            return (
              <TagButton
                key={idx}
                onClick={() => this.selectTag1(subi)}
                className={
                  !this.state.tag1
                    ? "mr-10 mt-10 color" + (subi.short ? "" : " full")
                    : this.state.tag1.short === subi.short
                    ? "mr-10 mt-10 color" + (subi.short ? "" : " full")
                    : "mr-10 mt-10 color bg-dark-gris"
                }
                color={
                  !this.state.tag1 || this.state.tag1.short === subi.short
                    ? (subi.short || "").replace(/ /g, "-")
                    : null
                }
              >
                <InnerButton>
                  {subi.icon ? (
                    <div
                      style={{
                        display: "flex",
                        marginRight: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Streamline
                        name={subi.icon}
                        stroke={"white"}
                        width={22}
                        height={22}
                      />
                    </div>
                  ) : null}
                  {subi.short}
                </InnerButton>
              </TagButton>
            );
          })}
          <StyledSub
            title={"Choisissez jusqu’à deux thèmes supplémentaires"}
            subtitle={
              "Ces thèmes secondaires permettent de compléter le référencement"
            }
            step={'2'}
            done={(this.state.tag2 || this.state.tag3) || this.state.noTag ? true : false}
          />
          {this.props.categories.map((subi, idx) => {
            return (
              <TagButton
                key={idx}
                onClick={() => this.selectTag2(subi)}
                className={
                  this.state.tag1 === subi.short
                    ? "mr-10  mt-10 color" + (subi.short ? "" : " full")
                    : "mr-10 mt-10 color bg-dark-gris"
                }
                color={
                  (this.state.tag2 && this.state.tag2.short === subi.short) ||
                  (this.state.tag3 && this.state.tag3.short === subi.short) ||
                  (!this.state.tag2 && !this.state.tag3 && !this.state.noTag)
                    ? (subi.short || "").replace(/ /g, "-")
                    : null
                }
                lighter={
                  (this.state.tag2 && subi.short === this.state.tag2.short) ||
                  (this.state.tag3 && this.state.tag3.short === subi.short) ||
                  (!this.state.noTag && !this.state.tag3 && !this.state.tag2)
                    ? true
                    : false
                }
              >
                <InnerButton>
                  {subi.icon ? (
                    <div
                      style={{
                        display: "flex",
                        marginRight: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Streamline
                        name={subi.icon}
                        stroke={"white"}
                        width={22}
                        height={22}
                      />
                    </div>
                  ) : null}
                  {subi.short}
                </InnerButton>
              </TagButton>
            );
          })}
          <FormGroup check className="case-cochee mt-10">
            <Label check>
              <Input
                type="checkbox"
                checked={this.state.noTag}
                onChange={this.tagCheck}
              />{" "}
              Je ne souhaite pas ajouter de thèmes supplémentaires
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <FButton
            tag={"a"}
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
            type="help"
            name="question-mark-circle-outline"
            fill={variables.noir}
          >
            {"Centre d'aide"}
          </FButton>
          <FButton
              type="tuto"
              name={"play-circle-outline"}
              className="ml-10"
              onClick={() => {}}
            >
              Tutoriel
            </FButton>
          <FButton
            type="outline-black"
            name="arrow-back"
            fill={variables.noir}
            className="mr-10"
            onClick={() => this.props.toggle()}
          >
            Retour
          </FButton>
          <FButton
            name="checkmark"
            type="validate"
            onClick={this.validateAndClose}
            disabled={
              !this.state.tag1 ||
              (this.state.tag1 &&
                !this.state.tag2 &&
                !this.state.tag3 &&
                !this.state.noTag)
            }
          >
            Valider
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(dispositifValidateModal);
