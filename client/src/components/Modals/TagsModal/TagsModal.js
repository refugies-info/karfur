import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import TagButton from "../../FigmaUI/TagButton/TagButton";
import Streamline from "../../../assets/streamline";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import { withTranslation } from "react-i18next";
import { colors } from "colors";
import Swal from "sweetalert2";
import FButton from "../../FigmaUI/FButton/FButton";

import "./TagsModal.scss";

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
  font-size: 15px !important;
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
  background-color: ${(props) => (props.done ? "#4caf50" : "#212121")};
  margin-right: 10px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Step = ({ ...props }) => {
  return (
    <Sphere done={props.done}>
      <Title selected>{props.children}</Title>
    </Sphere>
  );
};

const StyledSub = ({ ...props }) => {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
      }}
      {...props}
    >
      <Step done={props.done}>{props.step}</Step>
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

  componentDidUpdate(prevProps) {
    if (this.props.tags !== prevProps.tags) {
      if (this.props.tags.length > 0) {
        if (this.props.tags[0]) {
          this.setState({ tag1: this.props.tags[0] });
        }
        if (this.props.tags[1]) {
          this.setState({ tag2: this.props.tags[1] });
        }
        if (this.props.tags[2]) {
          this.setState({ tag3: this.props.tags[2] });
        }
        if (!this.props.tags[1] && !this.props.tags[2]) {
          this.setState({ noTag: true });
        }
      }
    }
  }

  selectTag1 = (subi) => {
    if (this.state.tag1 && this.state.tag1.short === subi.short) {
      this.setState({ tag1: null });
    } else {
      this.setState({ tag1: subi });
    }

    if (this.state.tag2 && subi.short === this.state.tag2.short) {
      this.setState({ tag2: null });
    }
    if (this.state.tag3 && subi.short === this.state.tag3.short) {
      this.setState({ tag3: null });
    }
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

  handleCheckboxChange = () =>
    this.setState((prevState) => ({
      noTag: !prevState.noTag,
      tag2: null,
      tag3: null,
    }));

  validateThemes = () => {
    Swal.fire({
      title: "Attention!",
      text: "Attention à ne pas valider la fiche sinon toutes les traductions vont tomber !",
      type: "alert",
    });
    this.props.toggle();
  };

  validateAndClose = () => {
    this.props.validate([this.state.tag1, this.state.tag2, this.state.tag3]);
    this.props.toggle();
  };
  render() {
    const isAdmin = this.props.user
      ? this.props.user.roles.find((element) => element.nom === "Admin")
        ? true
        : false
      : false;
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="tags-modal"
      >
        <ModalHeader toggle={this.props.toggle}>Choix des thèmes</ModalHeader>
        <ModalBody>
          <StyledSub
            title={"Choisissez le thème principal de votre fiche"}
            subtitle={
              "Ce thème catégorise votre fiche pour le moteur de recherche"
            }
            step={"1"}
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
                  {this.state.tag1 && this.state.tag1.short === subi.short ? (
                    <EVAIcon
                      onClick={() => {}}
                      name="close-outline"
                      fill={"white"}
                      className="sort-btn ml-2"
                    />
                  ) : null}
                </InnerButton>
              </TagButton>
            );
          })}
          <StyledSub
            title={"Choisissez jusqu’à deux thèmes supplémentaires"}
            subtitle={
              "Ces thèmes secondaires permettent de compléter le référencement"
            }
            step={"2"}
            done={
              this.state.tag2 || this.state.tag3 || this.state.noTag
                ? true
                : false
            }
          />
          {this.props.categories.map((subi, idx) => {
            return (
              <TagButton
                key={idx}
                onClick={() =>
                  this.state.tag1 && subi.short === this.state.tag1.short
                    ? null
                    : this.selectTag2(subi)
                }
                className={
                  this.state.tag1 === subi.short
                    ? "mr-10  mt-10 color" + (subi.short ? "" : " full")
                    : "mr-10 mt-10 color bg-dark-gris"
                }
                color={
                  this.state.tag1 && subi.short === this.state.tag1.short
                    ? null
                    : (this.state.tag2 &&
                        this.state.tag2.short === subi.short) ||
                      (this.state.tag3 &&
                        this.state.tag3.short === subi.short) ||
                      (!this.state.tag2 && this.state.tag3) ||
                      (this.state.tag2 && !this.state.tag3) ||
                      (!this.state.tag2 &&
                        !this.state.tag3 &&
                        !this.state.noTag)
                    ? (subi.short || "").replace(/ /g, "-")
                    : null
                }
                lighter={
                  this.state.tag1 && subi.short === this.state.tag1.short
                    ? false
                    : (!this.state.noTag &&
                        !this.state.tag3 &&
                        !this.state.tag2) ||
                      (!this.state.tag3 &&
                        this.state.tag2 &&
                        this.state.tag2.short !== subi.short) ||
                      (this.state.tag3 &&
                        !this.state.tag2 &&
                        this.state.tag3.short !== subi.short)
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
                  {(this.state.tag2 && this.state.tag2.short === subi.short) ||
                  (this.state.tag3 && this.state.tag3.short === subi.short) ? (
                    <EVAIcon
                      onClick={() => {}}
                      name="close-outline"
                      fill={"white"}
                      className="sort-btn ml-2"
                    />
                  ) : null}
                </InnerButton>
              </TagButton>
            );
          })}
          <div
            style={{
              backgroundColor: this.state.noTag ? "#def6c2" : "#f2f2f2",
              borderRadius: 10,
              padding: 2,
              paddingTop: 18,
              marginTop: 30,
              paddingLeft: 14,
              cursor: "pointer",
            }}
            onClick={this.handleCheckboxChange}
          >
            <label className="container">
              <input
                onChange={this.handleCheckboxChange}
                type="checkbox"
                checked={this.state.noTag}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ marginLeft: 30, fontSize: 14 }}>
              Je ne souhaite pas ajouter de thèmes supplémentaires
            </p>
          </div>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "space-between" }}>
          <div style={{ justifyContent: "flex-start", display: "flex" }}>
            {isAdmin ? (
              <FButton
                className="footer-btn"
                type="dark"
                name="shield-outline"
                disabled={
                  !this.state.tag1 ||
                  (this.state.tag1 &&
                    !this.state.tag2 &&
                    !this.state.tag3 &&
                    !this.state.noTag)
                }
                fill={colors.noir}
                onClick={this.validateThemes}
              >
                {"Valider seulement les thèmes"}
              </FButton>
            ) : (
              <>
                <FButton
                  tag={"a"}
                  href="https://help.refugies.info/fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-btn"
                  type="help"
                  name="question-mark-circle-outline"
                  fill={colors.noir}
                >
                  {"Centre d'aide"}
                </FButton>
                <FButton
                  type="tuto"
                  name={"play-circle-outline"}
                  className="ml-10"
                  onClick={() => this.props.toggleTutorielModal("Tags")}
                >
                  Tutoriel
                </FButton>
              </>
            )}
          </div>

          <div style={{ justifyContent: "flex-end", display: "flex" }}>
            <FButton
              type="outline-black"
              name="arrow-back"
              fill={colors.noir}
              className="mr-10"
              onClick={this.props.toggle}
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
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(dispositifValidateModal);
