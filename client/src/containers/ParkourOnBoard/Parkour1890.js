import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import { Col, Row, CardBody, CardFooter } from "reactstrap";

import illu from "../../assets/illu-je suis-3e1dc23707.svg";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { randomColor } from "../../components/Functions/ColorFunctions";

import "./ParkourOnBoard.scss";

class Dispositifs extends Component {
  state = {
    cards: new Array(8).fill({ title: "JE SUIS..." }),
  };

  componentDidMount() {}

  render() {
    return (
      <div className="animated fadeIn parkour-on-board">
        <Row className="full-width">
          <Col lg="6">
            <h1 className="logo">Agir</h1>
            <div className="stack">
              <div>
                <div className="panel-old">A faire</div>
                <div className="panel">
                  <div className="peel">
                    <svg width="60" height="60" className="">
                      <path
                        shapeRendering="geometricPrecision"
                        d="M60 0 L60 60 L0 60 Z"
                        stroke="transparent"
                        fill="#103E78"
                      ></path>
                      <path
                        shapeRendering="geometricPrecision"
                        d="M59.5 0 L60 60 L0 59.5"
                        stroke="transparent"
                        fill="#42CBB2"
                      ></path>
                    </svg>
                    <div className="peel__bottom"></div>
                    <div className="peel__top"></div>
                  </div>
                  <div className="panel__back">
                    <svg
                      className="icon icon-ui-arrow-left"
                      viewBox="0 0 11 15"
                      width="11"
                      height="15"
                    >
                      <use href="#ui-arrow-left"></use>
                    </svg>
                    <p>Retour</p>
                  </div>
                  <div className="panel__content">
                    <div className="panel__content__name">1. Je suis…</div>
                    <h1 className="panel__content__title">1. Je suis…</h1>
                    <div className="panel__content__text">
                      <div className="line">
                        <div className="inner">
                          Qui êtes-vous&nbsp;? Quel est votre profil&nbsp;?
                        </div>
                      </div>
                      <div className="line">
                        <div className="inner">
                          Dites-nous en un peu sur vous&nbsp;!
                        </div>
                      </div>
                    </div>
                    <div className="panel__content__image">
                      <img src={illu} />
                    </div>
                  </div>
                  <div className="panel__action"></div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="6">
            <Row>
              {this.state.cards.map((card, id) => {
                return (
                  <Col xs="12" sm="6" md="4" className="card-col" key={id}>
                    <CustomCard>
                      <CardBody>
                        <h3>{card.title}</h3>
                        <p>
                          Culpa aliqua nisi tempor duis. Voluptate amet enim
                          dolor amet. Labore adipisicing consectetur dolor nisi
                          ex amet.
                        </p>
                      </CardBody>
                      <CardFooter className={"align-right bg-" + randomColor()}>
                        Nom Dispositif
                      </CardFooter>
                    </CustomCard>
                  </Col>
                );
              })}
              <Col xs="12" sm="6" md="4">
                <CustomCard addCard onClick={this.goToDispositif}>
                  <CardBody>
                    <span className="add-sign">+</span>
                  </CardBody>
                  <CardFooter className={"align-right bg-secondary"}>
                    Créer un nouveau dispositif
                  </CardFooter>
                </CustomCard>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: "Dispositifs",
})(withTranslation()(Dispositifs));
