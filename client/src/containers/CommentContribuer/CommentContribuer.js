import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {Row, Col, Card, CardHeader, CardFooter, CardBody} from 'reactstrap';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

import API from '../../utils/API';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import SVGIcon from '../../components/UI/SVGIcon/SVGIcon';
import {fColorAvancement} from '../../components/Functions/ColorFunctions';
import {image_corriger} from '../../assets/figma';
import {CheckDemarcheModal} from '../../components/Modals';

import './CommentContribuer.scss';
import variables from 'scss/colors.scss';

class CommentContribuer extends Component {
  state={
    showModals:{ checkDemarche: false },
    users:[],
  }

  componentDidMount (){
    API.get_users({query: {status: "Actif"}, populate: 'roles'}).then(data => this.setState({users: data.data.data}) );
    window.scrollTo(0, 0);
  }

  toggleModal = (show, name) => this.setState(prevState=>({showModals:{...prevState.showModals,[name]:show}}))

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render() {
    const {t, langues} = this.props;
    const {showModals, users} = this.state;
    return (
      <div className="animated fadeIn comment-contribuer texte-small">
        <section id="hero">
          <div className="hero-container">
            <h1>{t("CommentContribuer.Comment contribuer", "Comment contribuer ?")}</h1>
            <div className="cartes-row">
              <div className="cartes-wrapper">
                <AnchorLink href="#ecrire">
                  <div className="carte-contrib">
                    <EVAIcon name="edit-outline" className="carte-icon" />
                    <h3 className="texte-footer">{t("CommentContribuer.écrire", "écrire")}</h3>
                  </div>
                </AnchorLink>
                <AnchorLink href="#traduire">
                  <div className="carte-contrib">
                    <EVAIcon name="edit-outline" className="carte-icon" />
                    <h3 className="texte-footer">{t("CommentContribuer.traduire", "traduire")}</h3>
                  </div>
                </AnchorLink>
                <AnchorLink href="#corriger">
                  <div className="carte-contrib">
                    <EVAIcon name="edit-outline" className="carte-icon" />
                    <h3 className="texte-footer">{t("CommentContribuer.corriger", "corriger")}</h3>
                  </div>
                </AnchorLink>
              </div>
            </div>
          </div>
          <AnchorLink href="#ecrire" className="arrowhead-icon header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon className="slide-bottom" name="arrowhead-down-outline" size="xlarge" fill={variables.noir} />
          </AnchorLink>
        </section>

        <section id="ecrire">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Écrire", "Écrire")}</h2>
              <h5>{t("CommentContribuer.Partageons l-information", "Partageons l’information !")}</h5>
            </div>

            <Row className="cards-row">
              <Col lg="3" className="card-col">
                <NavLink to="/dispositif" className="no-decoration">
                  <Card className="dispositif-card">
                    <CardHeader>{t("CommentContribuer.Ajouter un dispositif", "Ajouter un dispositif d'accompagnement")}</CardHeader>
                    <CardBody>
                      Rédigez la fiche pratique d'un dispositif d'accompagnement pour que les personnes réfugiées soient pleinement informées et puissent s'y engager.
                    </CardBody>
                    <CardFooter>
                      <EVAIcon name="clock-outline" className="clock-icon" />
                      <span className="float-right">~ 20 {t("minutes", "minutes")}</span>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col lg="3" className="card-col">
                <Card className="cursor-pointer demarche-card" onClick={()=>this.toggleModal(true, "checkDemarche")}>
                  <CardHeader>{t("CommentContribuer.Expliquer une démarche administrative", "Expliquer une démarche administrative")}</CardHeader>
                  <CardBody>
                    Rédigez la fiche pratique d'une démarche administrative qui détaille, étape par étape, les actions à mener pour la réussir.
                  </CardBody>
                  <CardFooter>
                    <EVAIcon name="clock-outline" className="clock-icon" />
                    <span>~ 20 {t("minutes", "minutes")}</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="3" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>{t("CommentContribuer.Ajouter une définition", "Ajouter une définition")}</CardHeader>
                  <CardBody>
                    Enrichissez le lexique collaboratif pour que tout le monde comprenne mieux les mots de l’intégration.
                  </CardBody>
                  <CardFooter>
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="3" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>{t("CommentContribuer.Créer un parcours", "Créer un parcours")}</CardHeader>
                  <CardBody>
                    Vous avez un objectif ? On vous liste les étapes à franchir pour l’atteindre dans notre moteur de parcours d’intégration.
                  </CardBody>
                  <CardFooter>
                    <span>{t("Printemps 2020", "Printemps 2020")}</span>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="traduire">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Traduire", "Traduire")}</h2>
              <h5>{t("CommentContribuer.Rendons l-information accessible", "Rendons l’information accessible à tous !")}</h5>
            </div>

            <div className="trad-layout">
              <div className="left-side">
                <h5>{t("CommentContribuer.Autre langue", "Vous parlez une autre langue ? Rejoignez-nous !")}</h5>
                <div className="data mb-20">
                  <div className="left-data"><h3>{(users.filter(x => (x.roles || []).some(y=>y.nom==="Trad")) || []).length}</h3></div>
                  <div className="right-data">{t("CommentContribuer.traducteurs actifs", "traducteurs actifs")}</div>
                </div>
                <div className="data">
                  <div className="left-data"><h3>{(users.filter(x => (x.roles || []).some(y=>y.nom==="ExpertTrad")) || []).length}</h3></div>
                  <div className="right-data">{t("CommentContribuer.experts en traduction", "experts en traduction")}</div>
                </div>
              </div>
              <div className="right-side">
                <Row className="langues-wrapper">
                  {langues.map(langue => (
                    <Col xl="4" lg="4" md="4" sm="4" xs="4" className="langue-col" key={langue._id}>
                      <NavLink to="/backend/user-dashboard">
                        <div className="langue-item">
                          <h5>
                          <i className={"mr-20 flag-icon flag-icon-" + langue.langueCode} title={langue.langueCode} />
                            {langue.langueFr}
                            <span className={"float-right color-" + fColorAvancement(langue.avancement)}>{Math.round((langue.avancement || 0) * 100, 0) + " %"}</span>
                          </h5>
                        </div>
                      </NavLink>
                    </Col> 
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </section>

        <section id="corriger">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Corriger", "Corriger")}</h2>
              <h5>{t("CommentContribuer.information juste", "Maintenons une information juste et à jour !")}</h5>
            </div>

            <div className="correct-layout">
              <div className="left-side">
                <Row>
                  <Col lg="2">
                    <div className="toolbar-icon-wrapper">
                      <EVAIcon name="message-circle-outline" fill={variables.noir} />
                    </div>
                  </Col>
                  <Col lg="10">
                    <div className="texte-normal">
                      <b>{t("CommentContribuer.Commentaire ciblé", "Commentaire ciblé")}</b>
                    </div>
                    <span className="texte-gris">{t("CommentContribuer.paragraphe erroné", "Un paragraphe est erroné ? Dites-le-nous !")}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg="2">
                    <div className="toolbar-icon-wrapper dark">
                      <EVAIcon name="edit-outline" />
                    </div>
                  </Col>
                  <Col lg="10">
                    <div className="texte-normal">
                      <b>{t("CommentContribuer.Suggestion de formulation", "Suggestion de formulation")}</b>
                    </div>
                    <span className="texte-gris">{t("CommentContribuer.Proposez directement", "Proposez directement une reformulation ou un ajout au texte pour aider les responsables")}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg="2">
                    <div className="toolbar-icon-wrapper">
                      <EVAIcon name="volume-up-outline" fill={variables.noir} />
                    </div>
                  </Col>
                  <Col lg="10">
                    <div className="texte-normal">
                      <b>{t("CommentContribuer.Écoute du texte", "Écoute du texte")}</b>
                    </div>
                    <span className="texte-gris">{t("CommentContribuer.Écoutez ou faites écouter", "Écoutez ou faites écouter les informations écrites de la plateforme")}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg="2">
                    <div className="toolbar-icon-wrapper dark">
                      <SVGIcon name="translate" fill="#FFFFFF"/>
                    </div>
                  </Col>
                  <Col lg="10">
                    <div className="texte-normal">
                      <b>{t("CommentContribuer.Traduction directe", "Traduction directe")}</b>
                    </div>
                    <span className="texte-gris">{t("CommentContribuer.paragraphe pas accessible", "Ce paragraphe n'est pas accessible dans une langue que vous maîtrisez ? Aidez-nous à le traduire !")}</span>
                  </Col>
                </Row>
              </div>
              <div className="right-side">
                <img src={image_corriger} className="image_corriger" />
              </div>
            </div>
          </div>
        </section>

        <CheckDemarcheModal show={showModals.checkDemarche} toggle={()=>this.toggleModal(false, "checkDemarche")} upcoming={this.upcoming} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  }
}

export default track({
  page: 'CommentContribuer',
})(
  connect(mapStateToProps)(
    withTranslation()(CommentContribuer)
  )
);