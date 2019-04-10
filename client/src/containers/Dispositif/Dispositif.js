import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Card, CardBody, CardHeader, Button, ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import {stringify} from 'himalaya';
import { connect } from 'react-redux';
import Scrollspy from 'react-scrollspy';
import ContentEditable from 'react-contenteditable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import marioProfile from '../../assets/mario-profile.jpg'
import API from '../../utils/API';
import EditableParagraph from '../../components/Frontend/Dispositif/EditableParagraph/EditableParagraph'
import QuickToolbar from './QuickToolbar/QuickToolbar';
import ReagirModal from '../../components/Modals/ReagirModal/ReagirModal';
import SVGIcon from '../../components/UI/SVGIcon/SVGIcon';

import {contenu, lorems} from './data'

import './Dispositif.scss';

const menu=[
  {title:'C\'est quoi ?'},
  {title:'C\'est pour qui ?'},
  {title:'À quoi ça me sert ?', children:[{title:'Travailler dans une association ou une organisation publique',accordion:true,content: lorems.sousParagraphe}]},
  {title:'Pourquoi ça m\'intéresse', children:[{title:'Vous êtes plutôt...',content: lorems.sousParagraphe}, {title:'Vous n\'êtes pas du tout',content: lorems.sousParagraphe}]},
  {title:'Comment y accéder', children:[{title:'Procédures',content: lorems.sousParagraphe}, {title:'Interlocuteurs experts',content: lorems.sousParagraphe}, {title:'Interlocuteurs concernés',content: lorems.sousParagraphe}]},
  {title:'Dispositifs connexes', children:[{title:'Dispositifs similaires',content: lorems.sousParagraphe}, {title:'Dispositifs complémentaires',content: lorems.sousParagraphe}]},
  {title:'Retours d\'expérience', children:[{title:'Questions réponses',content: lorems.sousParagraphe}, {title:'Avis',content: lorems.sousParagraphe}]},
]

const spyableMenu = menu.reduce((r, e, i) => {
  r.push('item-'+i);
  (e.children || []).map((_,subkey)=> {return r.push('item-'+i+'-sub-'+subkey)})
  return r
}, []);

const tags=[{name: "people", text: "18-25 ans"}, {name: "horloge", text: "6-12 mois"},{name: "papiers", text: "Réfugiés & BPI"},{name: "carte", text: "Sur tout le territoire"},{name: "frBubble", text: "Équivalent A1"}]

class Dispositif extends Component {
  state={
    menu: menu.map((x) => {return {...x, accordion:false, content: lorems.paragraphe, editorState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(lorems.paragraphe).contentBlocks))}}),
    content:contenu,
    hovers: menu.map((x) => {return {isHover:false, ...( x.children && {children: new Array(x.children.length).fill({isHover:false})})}}),
    modal:{
      show:false,
    },
    accordion: new Array(1).fill(false),
    disableEdit:true,
  }
  _initialState=this.state;

  componentDidMount (){
    let itemId=this.props.match && this.props.match.params && this.props.match.params.id;
    if(itemId){
      API.get_dispositif({_id: itemId}).then(data_res => {
        let dispositif={...data_res.data.data[0]};
        console.log(dispositif);
        this.setState({
          menu:dispositif.contenu, 
          content:{titreInformatif:dispositif.titreInformatif, titreMarque: dispositif.titreMarque, abstract: dispositif.abstract}, 
        })
      },function(error){
        console.log(error);
        return;
      })
    }else{
      this.setState({disableEdit:false})
    }
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({
      accordion: state,
    });
  }

  onMenuNavigate = (tab) => {
    const prevState = this.state.menu;
    const state = prevState.map((x, index) => tab === index ? {...x, accordion : !x.accordion} : {...x, accordion: false});
    this.setState({
      menu: state,
    });
  }

  _handleScrollSpy = el => {
    if(el && el.id && el.id.includes('item-')){
      let num=parseInt(el.id.replace( /^\D+/g, ''),10);
      if(this.state.menu.length>num && this.state.menu[num].children && this.state.menu[num].children.length>0){
        this.onMenuNavigate(num)
      }
    }
  }

  _handleChange = (ev) => {
    this.setState({ content: {
      ...this.state.content,
      [ev.currentTarget.id]:ev.target.value
     }
    });
  };

  handleMenuChange = (ev) => {
    let state=[...this.state.menu];
    if(ev.currentTarget && state.length > ev.currentTarget.id){
      if(ev.currentTarget.getAttribute('subkey') !== null && ev.currentTarget.getAttribute('subkey') !== undefined && state[ev.currentTarget.id].children.length > ev.currentTarget.getAttribute('subkey')){
        state[ev.currentTarget.id].children[ev.currentTarget.getAttribute('subkey')].content = ev.target.value;
      }else{
        state[ev.currentTarget.id].content = ev.target.value;
      }
      this.setState({
        menu: state,
      });
    }
  };

  handleContentClick = (key, editable, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      let right_node=state[key];
      if(subkey !==null && state[key].children.length > subkey){right_node= state[key].children[subkey];}
      right_node.editable = editable;
      if(editable){
        right_node.editorState=EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(right_node.content).contentBlocks));
      }else{
        right_node.content=draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
      }
      this.setState({
        menu: state,
      });
    }
  };

  onEditorStateChange = (editorState, key, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      if(subkey!==null && state[key].children.length > subkey){
        state[key].children[subkey].editorState =  editorState;
      }else{
        state[key].editorState =  editorState;
      }
      this.setState({
        menu: state,
      });
    }
  };

  _hoverOn=(key, subkey=null)=>{
    let state=JSON.parse(JSON.stringify(this._initialState.hovers));
    if(state.length > key){
      if(subkey!==null && state[key].children.length > subkey){
        state[key].children[subkey].isHover = true;
      }else{
        state[key].isHover = true;
      }
      this.setState({
        hovers: state,
      });
    }
  }

  toggleModal = (show) => {
    this.setState({modal:{...this.state.modal,show:show}})
  }

  valider_dispositif = () => {
    let dispositif = {
      ...this.state.content,
      contenu : [...this.state.menu.map(x=> {return {title: x.title, content : x.content, ...( x.children && {children : x.children.map(y => {return {title: y.title, content : y.content}})})}})]
    }
    console.log(this.state)
    console.log(dispositif)
    API.add_dispositif(dispositif).then((data) => {
      console.log(data.data)
    },(error)=>{
      console.log(error);return;})
  }

  render(){
    const {t} = this.props;

    return(
      <div className="animated fadeIn dispositif">
        <section className="banniere-dispo">
          <Row className="header-row">
            <Col className="top-left">
              <i className="cui-arrow-left icons"></i> 
              <span>Retour à la recherche</span>
            </Col>
            <Col className="top-right">
              <p># Insertion professionnelle</p>
              <p># Apprendre le français</p>
            </Col>
          </Row>
          <Col lg="12" md="12" sm="12" className="post-title-block">
            <div className="bloc-titre">
              <h1>
                <ContentEditable
                  id='titreInformatif'
                  html={this.state.content.titreInformatif}  // innerHTML of the editable div
                  disabled={this.state.disableEdit}       // use true to disable editing
                  onChange={this._handleChange} // handle innerHTML change
                />
              </h1>
              <h2 className="bloc-subtitle">
                avec le programme&nbsp;
                <ContentEditable
                  id='titreMarque'
                  html={this.state.content.titreMarque}  // innerHTML of the editable div
                  disabled={this.state.disableEdit}
                  onChange={this._handleChange} // handle innerHTML change
                />
              </h2>
            </div>
          </Col>
          <Row className="header-footer">
            <Col className="align-right">
              Dernière mise à jour : <span className="date-maj">3 avril 2019</span>
            </Col>
            <Col>
              Fiabilité de l'information : <span className="fiabilite">Faible</span>
            </Col>
          </Row>
          <div className="contrustion-wrapper">
            <SVGIcon name="construction" />
            <b>En construction</b>
          </div>
        </section>
        <Row className="tags-row">
          <b className="en-bref">En bref : </b>
          {tags.map((icon, key) => {
            return (
              <div className="tag-wrapper" key={key}>
                <div className="tag-item">
                  <SVGIcon name={icon.name} />
                  <span>{icon.text}</span>
                </div>
              </div>
            )}
            )}
        </Row>
        <Row className="give-it-space">
          <Col md="3">
            <div className="sticky-affix">
              <Card my="4">
                <CardHeader>Menu</CardHeader>
                <CardBody>
                  <ListGroup className="list-group-flush">

                    <Scrollspy 
                      items={ this.state.menu.map((_,key) => 'item-'+key) }
                      currentClassName="active"
                      onUpdate={this._handleScrollSpy}>
                      {this.state.menu.map((item, key) => {
                        return ( 
                          <div key={key} className="list-item-wrapper">
                            <ListGroupItem tag="a" data-toggle="list" action
                              href={'#item-head-' + key} 
                              onClick={() => this.onMenuNavigate(key)} >
                              {item.title}
                            </ListGroupItem>
                            {item.children &&
                              <Collapse isOpen={this.state.menu[key].accordion} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <ListGroup>
                                  {item.children.map((subitem, subkey) => {
                                    return ( 
                                      <div key={subkey}>
                                        <ListGroupItem 
                                          tag="a" 
                                          action 
                                          href={'#item-head-' + key + '-sub-' + subkey} >
                                          {subitem.title}
                                        </ListGroupItem>
                                      </div>
                                    )}
                                  )}
                                </ListGroup>
                              </Collapse>
                            }
                          </div>
                        )}
                      )}
                    </Scrollspy>
                  </ListGroup>
                </CardBody>
              </Card>
              <Card my="4">
                <h5 className="card-header">{t('article.Explication en 30 secondes')}</h5>
                <div className="card-body">
                  <ContentEditable
                    id='abstract'
                    html={this.state.content.abstract}  // innerHTML of the editable div
                    disabled={this.state.disableEdit}       // use true to disable editing
                    onChange={this._handleChange} // handle innerHTML change
                  />
                </div>
              </Card>
            </div>
          </Col>
          <Col lg="6">
            <div className="subtitle-container">
              <div className="profile-header-container">   
                <img className="img-circle" src={marioProfile} alt="profile"/>
                <div className="rank-label-container">
                    <span className="label label-default rank-label" onClick={this.editProfile}>Changer</span>
                </div>
              </div> 
            </div>

            {this.state.menu.map((item, key) => {
              return ( 
                <div key={key} className='contenu-wrapper'>
                  <Row className="relative-position" onMouseEnter={()=>this._hoverOn(key)}>
                    <Col lg="12">
                      <a className="anchor" id={'item-head-'+key}></a>
                      <h3>
                        {item.title}
                        <i onClick={()=>this.handleContentClick(key,true)} className="cui-pencil icons font-xl float-right"></i>
                      </h3>
                      <EditableParagraph 
                        idx={key} 
                        handleMenuChange={this.handleMenuChange}
                        onEditorStateChange={this.onEditorStateChange}
                        handleContentClick={this.handleContentClick}
                        disableEdit={this.state.disableEdit}
                        {...item}/>
                    </Col>
                    <Col className='toolbar-col'>
                      <QuickToolbar 
                        show={this.state.hovers[key].isHover}
                        disableEdit={this.state.disableEdit}
                        toggleModal={this.toggleModal} />
                    </Col>
                  </Row>
                  <br />
                  {item.children && item.children.map((subitem, subkey) => {
                    if(subitem.accordion){
                      return ( 
                        <div key={subkey}>
                          <Button id="accordion-header" color="warning" className="text-left" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                            <h5>
                              <div className="accordion-number">{subkey+1}</div>
                              <span className="accordion-text">
                                <ContentEditable
                                  id='title'
                                  subkey={subkey}
                                  html={subitem.title}  // innerHTML of the editable div
                                  disabled={this.state.disableEdit}       // use true to disable editing
                                  onChange={this.handleMenuChange} // handle innerHTML change
                                />
                              </span>
                              <div className="accordion-expand">+</div>
                            </h5>
                          </Button>
                          <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <EditableParagraph 
                              idx={key} 
                              subkey={subkey} 
                              handleMenuChange={this.handleMenuChange}
                              onEditorStateChange={this.onEditorStateChange}
                              handleContentClick={this.handleContentClick}
                              disableEdit={this.state.disableEdit}
                              {...subitem} />
                          </Collapse>
                        </div>
                      )
                    }else{
                      return ( 
                        <div key={subkey}>
                          <Row className="relative-position">
                            <Col lg="12">
                              <h4>
                                {subitem.title}
                                {!this.state.disableEdit 
                                  &&
                                  <i onClick={()=>this.handleContentClick(key,true, subkey)} className="cui-pencil icons font-xl float-right"></i>
                                }
                              </h4>
                              <EditableParagraph 
                                idx={key} 
                                subkey={subkey} 
                                handleMenuChange={this.handleMenuChange}
                                onEditorStateChange={this.onEditorStateChange}
                                handleContentClick={this.handleContentClick}
                                disableEdit={this.state.disableEdit}
                                {...subitem} />
                              <br />
                            </Col>
                            <Col className='toolbar-col'>
                              <QuickToolbar />
                            </Col>
                          </Row>
                        </div>
                      )
                    }}
                  )}
                  <a className="anchor" id={'item-' + key}></a>
                </div>
              )}
            )}
            

            <Button onClick={this.valider_dispositif} color="success" size="lg" block>
              Valider ce dispositif
            </Button>

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
          <Col md="3">
            <Card my="4">
              <h5 className="card-header">{t('article.Catégories')}</h5>
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
              <h5 className="card-header">{t('article.Chercher')}</h5>
              <div className="card-body">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Chercher..." />
                  <span className="input-group-btn">
                    <button className="btn btn-secondary" type="button">{t('article.Aller')}</button>
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        <ReagirModal 
          modal={this.state.modal}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.languei18nCode
  }
}

export default track({
    page: 'Dispositif',
  })(
    connect(mapStateToProps)(
      withTranslation()(Dispositif)
    )
  );