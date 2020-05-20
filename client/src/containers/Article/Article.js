import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import { Col, Row, Card, Spinner } from "reactstrap";
import ReactHtmlParser from "react-html-parser";
import { stringify } from "himalaya";
import { connect } from "react-redux";

import BigPhoto from "../../assets/big-photo-buildings.jpeg";
import API from "../../utils/API";
import TranslationModal from "../../components/Modals/TranslationModal/TranslationModal";

import "./Article.scss";
import "bootstrap/dist/css/bootstrap.css";

let newId = 0;
class Article extends Component {
  state = {
    loading: true,
    francais: {
      title: "",
      body: "",
    },
    translated: {
      body: "",
      title: "",
    },
    itemId: "",
    tooltipOpen: [],
    id_array: [],
    showModal: false,
    initial_string: "",
    translated_string: "",
    currentId: "",
    loadingModalData: false,
    right_node: [],
    chemin: [],
  };

  componentDidMount() {
    this._loadArticle();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    this._loadArticle(nextProps.languei18nCode, true, nextProps);
  }

  _loadArticle = (
    i18nCode = this.props.languei18nCode,
    update = true,
    props = {}
  ) => {
    let itemId =
      this.props.match && this.props.match.params && this.props.match.params.id;
    newId = 0;
    if (itemId) {
      API.get_article({ _id: itemId }, i18nCode).then(
        (data_res) => {
          if (
            data_res.data.data.constructor === Array &&
            data_res.data.data.length > 0
          ) {
            let article = { ...data_res.data.data[0] };
            if (update) {
              let editedBody = JSON.parse(JSON.stringify(article.body)); //deep copy
              if (i18nCode !== "fr") {
                editedBody = [
                  ...this._make_body_editable({ children: [...editedBody] }),
                ];
              }
              this.setState(
                {
                  bodyInitial: [...editedBody],
                  translated: {
                    title: article.title,
                    body: stringify([...editedBody]),
                  },
                  itemId: article._id,
                  loading: false,
                  francais:
                    i18nCode === "fr"
                      ? {
                          title: article.title,
                          body: [...article.body],
                        }
                      : this.state.francais,
                },
                () => {
                  if (i18nCode !== "fr") {
                    var pens = document.querySelectorAll("[id*=edit-pencil-]");
                    for (var i = 0; i < pens.length; i++) {
                      pens[i].onclick = (e) => this.openEditModal(e);
                    }
                    //this.all_tooltips(); //A réactiver après, là ça me saoûle
                  }
                }
              );
            } else if (i18nCode === "fr") {
              this.setState(
                {
                  francais: {
                    title: article.title,
                    body: article.body,
                  },
                },
                () => {
                  this._updateStateForModal(this.state.currentId);
                }
              );
            }
          }
        },
        (error) => {
          console.log(error);
          return;
        }
      );
    } else if (props.id) {
      this.setState({
        translated: props.translated,
        itemId: props.id,
        loading: false,
        francais: props.francais,
      });
    }
  };

  make_tag_editable = (html) => {
    if (html && html.children) {
      try {
        [].forEach.call(html.children, (el, i) => {
          if (el.hasChildNodes() && el.children.length > 1) {
            this.make_tag_editable(el);
          } else if (el.innerText !== "" && el.innerText !== " ") {
            newId += 1;
            var newEl = document.createElement("i");
            newEl.className = "cui-pencil icons font-xl display-on-hover";
            newEl.id = "edit-pencil-" + newId;
            newEl.onclick = () => this.openEditModal(newEl.id);
            el.appendChild(newEl);
            el.id = el.id + (el.id ? " " : "") + "tag-id-" + newId;
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  _make_body_editable = (body) => {
    let children = body.children || [];
    for (var i = 0; i < children.length; i++) {
      let node = children[i];
      if (node.content && node.content.replace(/\s/g, "").length) {
        let attributes = body.attributes || [];
        let idNode = attributes.find((x) => x.key === "id" && x);
        newId++;
        children[i] = {
          type: "element",
          tagName: "span",
          attributes: [
            {
              key: "id",
              value: "tag-id-" + newId + (idNode ? " " + idNode.value : ""),
            },
          ],
          children: [
            { ...node },
            {
              type: "element",
              tagName: "i",
              attributes: [
                {
                  key: "class",
                  value: "cui-pencil icons font-xl display-on-hover",
                },
                { key: "id", value: "edit-pencil-" + newId },
              ],
              children: [],
            },
          ],
        };
      } else if ((node.children || []).length > 0) {
        node = this._make_body_editable(node);
      }
    }
    return children;
  };

  toggle = (i) => {
    const newArray = this.state.tooltipOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      tooltipOpen: newArray,
    });
  };

  all_tooltips = () => {
    try {
      this.setState({
        id_array: Array.from({ length: newId }, (v, k) => k + 1),
        tooltipOpen: Array.from({ length: newId }, (v, k) => false),
      });
    } catch (e) {
      console.log(e);
    }
  };

  openEditModal = (e) => {
    if (e.target.id.includes("edit-pencil-")) {
      let path = e.path || (e.composedPath && e.composedPath());
      if (!path || path.length < 2) {
        return;
      }
      e.preventDefault();
      try {
        var pathId = 0;
        while (
          path[pathId].id.substring(0, 8) !== "initial_" &&
          pathId < path.length
        ) {
          pathId++;
        }
      } catch (err) {
        pathId = 2;
      }
      let rightId = path[pathId].id;
      this.setState({
        currentId: rightId,
        loadingModalData: true,
        chemin: path.map((x) => {
          return { id: x.id, tagName: x.tagName };
        }),
      });

      if (this.state.francais.body) {
        this._updateStateForModal(rightId);
      } else {
        this._loadArticle("fr", false);
      }
    }
    return true;
  };

  _updateStateForModal = (id) => {
    let right_node = this._findId({ children: this.state.francais.body }, id);
    if (right_node) {
      let domNode = document.querySelector("[id*=" + id + "]").cloneNode(true);
      this.removePencil(domNode);
      this.setState({
        initial_string: stringify([right_node]),
        translated_string: domNode.outerHTML,
        showModal: true,
        right_node: [right_node],
      });
    }
  };

  removePencil = (html) => {
    if (html && html.children) {
      try {
        [].forEach.call(html.children, (el) => {
          if (el.hasChildNodes()) {
            this.removePencil(el);
          } else if (el.tagName === "I" && el.id.includes("edit-pencil-")) {
            el.parentNode.removeChild(el);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  _findId = (body, idToFind) => {
    let children = body.children || [];
    let right_node = null;
    for (var i = 0; i < children.length; i++) {
      let node = children[i];
      if (node.content) {
        let attributes = body.attributes || [];
        for (var j = 0; j < attributes.length; j++) {
          if (attributes[j].key === "id") {
            if (attributes[j].value === idToFind) {
              right_node = body;
              break;
            }
          }
        }
      }
      if (!right_node && (node.children || []).length > 0) {
        right_node = this._findId(node, idToFind);
      }
    }
    return right_node;
  };

  suggestTranslation = () => {
    //Je vais récupérer la traduction d'origine en premier :
    let right_node = this._findId(
      { children: this.state.bodyInitial },
      this.state.currentId
    );
    let traduction = {
      langueCible: this.props.languei18nCode,
      articleId: this.props.match.params.id,
      initialText: this.state.right_node,
      translatedText: this.state.translated_string,
      initialTranslatedText: right_node,
      rightId: this.state.currentId,
      chemin: this.state.chemin,
    };
    API.add_tradForReview(traduction).then(
      (data_res) => {
        this.modalClosed();
      },
      (error) => {
        console.log(error);
        return;
      }
    );
  };

  modalClosed = () => {
    this.setState({
      initial_string: "",
      translated_string: "",
      showModal: false,
      currentId: "",
    });
  };

  handleTranslationChange = (event) => {
    this.setState({
      translated_string: event.target.value,
    });
  };

  render() {
    var divStyle = {
      backgroundImage: "url(" + BigPhoto + ")",
    };
    const { t } = this.props;

    const Contenu = () => {
      if (this.state.loading) {
        return (
          <div className="text-center">
            <Spinner color="success" className="fadeIn fadeOut" />
          </div>
        );
      } else {
        return (
          <div id="rendered-article" onClick={(e) => this.openEditModal(e)}>
            {ReactHtmlParser(this.state.translated.body)}

            {/* {this.state.id_array.map((element) => {
              return (
                <Tooltip 
                  placement="top" 
                  isOpen={this.state.tooltipOpen[element]} 
                  target={"edit-pencil-" + element}
                  toggle={()=>this.toggle(element)}
                  key={element}>
                  Corriger la traduction de cet élément
                </Tooltip>
              );
            })} */}
          </div>
        );
      }
    };

    return (
      <div className="animated fadeIn article">
        <TranslationModal
          show={this.state.showModal}
          initial_string={this.state.initial_string}
          translated_string={this.state.translated_string}
          handleTranslationChange={this.handleTranslationChange}
          clicked={this.suggestTranslation}
          modalClosed={this.modalClosed}
          editable={true}
        />
        <section className="banner-section" style={divStyle} />

        <section className="post-content-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 post-title-block">
                <h1 className="text-center">
                  {this.state.translated.title || (
                    <Spinner color="success" className="fadeIn fadeOut" />
                  )}
                </h1>
              </div>
            </div>
            <Row>
              <Col lg="8">
                <h1 className="mt-4">{t("contenu.article.1.sous-titre")}</h1>
                <p className="lead">
                  {t("global.article.par")} Disney,{" "}
                  {t("global.article.adapte_par")} Souf
                </p>

                <hr />
                <p>{t("global.article.poste_le")} le 05/03/2018</p>
                <hr />

                <Contenu />

                <hr />
                <div className="card my-4">
                  <h5 className="card-header">
                    {t("global.article.laisser_commentaire")} :
                  </h5>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        {t("global.article.soumettre")}
                      </button>
                    </form>
                  </div>
                </div>
                <div className="media mb-4">
                  <img
                    className="d-flex mr-3 rounded-circle"
                    src="http://placehold.it/50x50"
                    alt=""
                  />
                  <div className="media-body">
                    <h5 className="mt-0">Alfred</h5>
                    J'aime beaucoup ce conte.
                  </div>
                </div>
                <div className="media mb-4">
                  <img
                    className="d-flex mr-3 rounded-circle"
                    src="http://placehold.it/50x50"
                    alt=""
                  />
                  <div className="media-body">
                    <h5 className="mt-0">Sarah</h5>
                    This is an amazing story. I hope I can read more of these.
                    Thanks a lot for the sharing.
                    <div className="media mt-4">
                      <img
                        className="d-flex mr-3 rounded-circle"
                        src="http://placehold.it/50x50"
                        alt=""
                      />
                      <div className="media-body">
                        <h5 className="mt-0">Ahmed</h5>
                        Ma fhemt 7ta 7aja fhad lnoukta. Chkoun l7ellouf ou
                        chkoun ldi2ab.
                      </div>
                    </div>
                    <div className="media mt-4">
                      <img
                        className="d-flex mr-3 rounded-circle"
                        src="http://placehold.it/50x50"
                        alt=""
                      />
                      <div className="media-body">
                        <h5 className="mt-0">Soufiane</h5>
                        Merci pour vos commentaires. J'essaierai d'adapter une
                        nouvelle histoire rapidement
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="4">
                <Card my="4">
                  <h5 className="card-header">
                    {t("article.Explication en 30 secondes")}
                  </h5>
                  <div className="card-body">
                    3 petits cochons construisent un abri pour se protéger du
                    loup. Le premier le construit en paille, le second en bois
                    et le troisième en briques. Quand le loup arrive, il détruit
                    les deux premières et seule la maison en brique tient.
                  </div>
                </Card>
                <Card my="4">
                  <h5 className="card-header">{t("article.Catégories")}</h5>
                  <div className="card-body">
                    <div className="row">
                      <Col lg="6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a href="/articles">Contes</a>
                          </li>
                          <li>
                            <a href="/articles">Enfants</a>
                          </li>
                          <li>
                            <a href="/articles">Histoires</a>
                          </li>
                        </ul>
                      </Col>
                      <Col lg="6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a href="/articles">Loup</a>
                          </li>
                          <li>
                            <a href="/articles">Cochons</a>
                          </li>
                          <li>
                            <a href="/articles">Briques</a>
                          </li>
                        </ul>
                      </Col>
                    </div>
                  </div>
                </Card>
                <Card my="4">
                  <h5 className="card-header">{t("article.Chercher")}</h5>
                  <div className="card-body">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Chercher..."
                      />
                      <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button">
                          {t("article.Aller")}
                        </button>
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

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.languei18nCode,
  };
};

export default track({
  page: "Article",
})(connect(mapStateToProps)(withTranslation()(Article)));
