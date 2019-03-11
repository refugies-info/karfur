import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Card, Tooltip } from 'reactstrap';
import draftToHtml from 'draftjs-to-html';
import ReactHtmlParser from 'react-html-parser';

import BigPhoto from '../../assets/big-photo-buildings.jpeg'
import API from '../../utils/API';
import TranslationModal from '../../components/Modals/TranslationModal/TranslationModal'

import './Article.scss';
import 'bootstrap/dist/css/bootstrap.css';

let newId=0;
class Article extends Component {
  state={
    title:'',
    body: [],
    itemId:'',
    tooltipOpen: [],
    id_array:[],
    showModal:false,
    initial_string:'',
    translated_string:'',
    currentId:''
  }

  componentDidMount (){
    let itemId=this.props.match.params.id;
    if(itemId){
      API.get_article({_id: itemId}).then(data_res => {
        console.log(data_res)
        let article=data_res.data.data[0];
        this.setState({
          title: article.title,
          body: draftToHtml(article.body),
          itemId: article._id,
        },()=>{
          this.make_tag_editable(document.getElementById('rendered-article'))
          this.all_tooltips();
        })
      },function(error){
        console.log(error);
        return;
      })
    }
  }

  make_tag_editable= (html) => {
    if(html && html.children){
      [].forEach.call(html.children, (el, i) => { 
        if(el.hasChildNodes() && el.children.length>1){
          this.make_tag_editable(el)
        }else if(el.innerText!=='' && el.innerText!==' '){
          newId+=1;
          var newEl = document.createElement('i');
          newEl.className="cui-pencil icons font-xl display-on-hover"
          newEl.id="edit-pencil-"+newId
          newEl.onclick=()=>this.openEditModal(newEl.id)
          el.appendChild(newEl);
          el.id=(el.id?' ':'') + 'tag-id-'+newId
        }
      });
    }
  }
  toggle=(i) =>{
    const newArray = this.state.tooltipOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      tooltipOpen: newArray,
    });
  }

  all_tooltips=()=>{
    this.setState({
      id_array: Array.from({length: newId}, (v, k) => k+1),
      tooltipOpen: Array.from({length: newId}, (v, k) => false),
    })
  }

  openEditModal = id => {
    this.setState({
      initial_string : document.getElementById(id.replace("edit-pencil-", 'tag-id-')).innerText,
      translated_string : document.getElementById(id.replace("edit-pencil-", 'tag-id-')).innerText,
      showModal:true,
      currentId:id
    })
  }

  suggestTranslation = () => {
    if(this.state.currentId){
      document.getElementById(this.state.currentId.replace("edit-pencil-", 'tag-id-')).innerText=this.state.translated_string
      this.setState({
        initial_string : '',
        translated_string : '',
        showModal:false,
        currentId:''
      })
    }
  }

  handleTranslationChange = event => {
    this.setState({
      translated_string: event.target.value
    });
  }

  render(){
    var divStyle = {
      backgroundImage: 'url(' + BigPhoto + ')'
    }
    const {t} = this.props;
    return(
      <div className="animated fadeIn article">
        <TranslationModal 
          show={this.state.showModal}
          initial_string={this.state.initial_string}
          translated_string={this.state.translated_string}
          clicked={this.suggestTranslation}
          handleTranslationChange={this.handleTranslationChange}
          />
        <section 
          className="banner-section"
          style={divStyle} />

        <section className="post-content-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 post-title-block">
                  <h1 className="text-center">
                    {/* {t('contenu.article.1.titre')} */}
                    {this.state.title}
                  </h1>
                  <ul className="list-inline text-center">
                      <li>{t('Auteur')} : {t('test.ici',{defaultValue: "hello"})}</li>
                      <li>{t('global.article.categorie')} : {t('contenu.article.1.categorie')}</li>
                      <li>{t('global.article.date')} : 1933</li>
                  </ul>
              </div>
            </div>
            <Row>
              <Col lg="8">
                <h1 className="mt-4">
                  {t("contenu.article.1.sous-titre")}
                </h1>
                <p className="lead">
                  {t('global.article.par')} Disney, {t('global.article.adapte_par')} Souf
                </p>

                <hr />
                <p>{t('global.article.poste_le')} le 05/03/2018</p>
                <hr />
                
                <div id="rendered-article">
                  {ReactHtmlParser(this.state.body)}

                  {this.state.id_array.map((element,key) => {
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
                  })}
                </div>

                <hr />
                <div className="card my-4">
                  <h5 className="card-header">{t('global.article.laisser_commentaire')} :</h5>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">{t('global.article.soumettre')}</button>
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