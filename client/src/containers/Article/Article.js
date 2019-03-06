import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Card } from 'reactstrap';

import {InitialText} from '../Translation/data'
import BigPhoto from '../../assets/big-photo-buildings.jpeg'

import './Article.css';
import 'bootstrap/dist/css/bootstrap.css';

class Article extends Component {
  render(){
    var divStyle = {
      backgroundImage: 'url(' + BigPhoto + ')'
    }
    const {t} = this.props;
    return(
      <div className="animated fadeIn article">
        <section 
          className="banner-section"
          style={divStyle} />

        <section className="post-content-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 post-title-block">
                  <h1 className="text-center">
                    <Trans i18nKey='test.ici'>
                    ça donne quoi?
                    </Trans>
                  </h1>
                  <ul className="list-inline text-center">
                      <li>Auteur : Disney</li>
                      <li>Catégorie : Contes pour enfants</li>
                      <li>Date : 1933</li>
                  </ul>
              </div>
            </div>
            <Row>
              <Col lg="8">
                <h1 className="mt-4">
                  {t("article.1.titre")}
                </h1>
                <p className="lead">
                  par Disney, adapté par Souf
                </p>

                <hr />
                <p>Posté le 05/03/2018</p>
                <hr />

                <InitialText />
                
                <hr />
                <div className="card my-4">
                  <h5 className="card-header">Laissez un commentaire :</h5>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Soumettre</button>
                    </form>
                  </div>
                </div>
                <div className="media mb-4">
                  <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="" />
                  <div className="media-body">
                    <h5 className="mt-0">Alfred</h5>
                    J'aime beaucoup ce conte.
                  </div>
                </div>
                <div className="media mb-4">
                  <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="" />
                  <div className="media-body">
                    <h5 className="mt-0">Sarah</h5>
                    This is an amazing story. I hope I can read more of these. Thanks a lot for the sharing.

                    <div className="media mt-4">
                      <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="" />
                      <div className="media-body">
                        <h5 className="mt-0">Ahmed</h5>
                        Ma fhemt 7ta 7aja fhad lnoukta. Chkoun l7ellouf ou chkoun ldi2ab. 
                      </div>
                    </div>

                    <div className="media mt-4">
                      <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="" />
                      <div className="media-body">
                        <h5 className="mt-0">Soufiane</h5>
                        Merci pour vos commentaires. J'essaierai d'adapter une nouvelle histoire rapidement
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="4">
                <Card my="4">
                  <h5 className="card-header">Explication en 30 secondes</h5>
                  <div className="card-body">
                    3 petits cochons construisent un abri pour se protéger du loup. Le premier le construit en paille, le second en bois et le troisième en briques. Quand le loup arrive, il détruit les deux premières et seule la maison en brique tient.
                  </div>
                </Card>
                <Card my="4">
                  <h5 className="card-header">Catégories</h5>
                  <div className="card-body">
                    <div className="row">
                      <Col lg="6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a href="#">Contes</a>
                          </li>
                          <li>
                            <a href="#">Enfants</a>
                          </li>
                          <li>
                            <a href="#">Histoires</a>
                          </li>
                        </ul>
                      </Col>
                      <Col lg="6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a href="#">Loup</a>
                          </li>
                          <li>
                            <a href="#">Cochons</a>
                          </li>
                          <li>
                            <a href="#">Briques</a>
                          </li>
                        </ul>
                      </Col>
                    </div>
                  </div>
                </Card>
                <Card my="4">
                  <h5 className="card-header">Chercher</h5>
                  <div className="card-body">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Chercher..." />
                      <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button">Aller</button>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    );
  }
}

export default track({
    page: 'Article',
  })(
    withTranslation()(Article)
  );