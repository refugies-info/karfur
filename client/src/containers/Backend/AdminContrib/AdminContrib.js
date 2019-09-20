import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardHeader, CardBody, Badge, Collapse, Table} from 'reactstrap';
import {NavLink} from 'react-router-dom'; 
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment/min/moment-with-locales';

import API from '../../../utils/API';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import {fetch_dispositifs} from '../../../Store/actions';
import {deleteContrib} from '../UserProfile/functions';

import './AdminContrib.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

const reviews_data=[
  {value: "En attente admin", explain: "(Déjà validé par une structure)"}, 
  {value: "Rejeté structure", explain: "(La structure considère que ce dispositif ne lui appartient pas)"}, 
  {value: "En attente non prioritaire", explain: "(Créé par un utilisateur, sans structure d'appartenance)"}, 
  {value: "En attente", explain: "(Doit être validé par la structure)"},
  {value: "Accepté structure", explain: "(La structure a accepté la paternité mais n'a pas encore validé le contenu)"},
]

class AdminContrib extends Component {
  constructor(props) {
    super(props);
    this.deleteContrib = deleteContrib.bind(this);
  }

  state={
    dispositifs:[],
    accordion: new Array(reviews_data.length).fill(false).map((_,i)=> i===0),
  };

  componentDidMount (){
    this._initializeContrib();
  }

  _initializeContrib = () => {
    API.get_dispositif({status:{$in: reviews_data.map(x=>x.value) }},{updatedAt: -1},'creatorId mainSponsor').then(data_res => {
      let dispositifs=[...data_res.data.data];
      this.setState({ dispositifs });
    })
  }

  toggleAccordion = tab => this.setState(pS => ({ accordion: pS.accordion.map( (x,i) => tab === i ? !x : false )} ));

  prepareDeleteContrib = (dispositif) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "La suppression d'un dispositif est irréversible",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: variables.rouge,
      cancelButtonColor: variables.vert,
      confirmButtonText: 'Oui, le supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        const newDispositif = {
          dispositifId: dispositif._id,
          status: "Supprimé"
        }
        this.deleteContrib(newDispositif, null, this._initializeContrib);
      }
    })
  }

  update_status = async (dispositif, status="Actif") => {
    let newDispositif = { status: status, dispositifId: dispositif._id };
    let question = {value: true};
    if(dispositif.status === "En attente" || dispositif.status === "Accepté structure"){
      question = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Ce dispositif n'a pas encore été validé par sa structure d'appartenance",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: variables.rouge,
        cancelButtonColor: variables.vert,
        confirmButtonText: 'Oui, le valider',
        cancelButtonText: 'Annuler'
      })
    }
    if(question.value){
      API.add_dispositif(newDispositif).then(() => {
        this.props.fetch_dispositifs();
        this.setState(pS => ({ dispositifs: pS.dispositifs.map(x => x._id === dispositif._id ? {...x, status: status} : x) }));
      });
    }
  }

  render() {
    const {accordion, dispositifs} = this.state;
    return (
      <div className="admin-contrib animated fadeIn">
        <Card>
          <CardHeader>
            Reviews
            <div className="card-header-actions">
              <Badge color="secondary">{(dispositifs.filter(x => reviews_data.includes(x.status)) || []).length}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div id="accordion">
              {reviews_data.map((status, index) => {
                const arr = dispositifs.filter(x => x.status===status.value) || [];
                return (
                  <Card className="mb-0" key={index}>
                    <CardHeader id="headingOne">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={accordion[index]} aria-controls="collapseOne">
                        {status.value + ' ' + status.explain}
                        <div className="card-header-actions">
                          <Badge color="alert" className="float-right">{arr.length}</Badge>
                        </div>
                      </Button>
                    </CardHeader>
                    <Collapse isOpen={accordion[index] && arr.length > 0} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                      <CardBody>
                        <Table responsive className="avancement-user-table">
                          <thead><tr><th>Titre</th><th>Depuis</th><th>Structure</th><th>Tej</th><th>Voir</th><th>Valider</th></tr></thead>
                          <tbody>
                            {arr.map((element,key) => {
                              return (
                                <tr key={key} >
                                  <td className="align-middle">
                                    <b>{element.titreMarque + ' - ' + element.titreInformatif}</b>
                                  </td>
                                  <td className="align-middle">
                                    {moment(element.updatedAt).fromNow()}
                                  </td>
                                  <td className="align-middle">
                                    {(element.mainSponsor || {}).acronyme || (element.mainSponsor || {}).nom}
                                  </td>
                                  <td className="align-middle pointer fit-content">
                                    <FButton type="light-action" name="archive-outline" fill={variables.noir} onClick={() => this.prepareDeleteContrib(element)} />
                                  </td>
                                  <td className="align-middle fit-content">
                                    <FButton tag={NavLink} to={"/dispositif/"+element._id} type="light-action" name="eye-outline" fill={variables.noir} />
                                  </td>
                                  <td className="align-middle fit-content">
                                    <FButton type="validate" name="checkmark-circle-outline" onClick={()=>this.update_status(element)}>
                                      Valider
                                    </FButton>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Collapse>
                  </Card>
                )}
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  }
}

const mapDispatchToProps = {fetch_dispositifs};

export default track({
  page: 'AdminContrib',
})(
  connect(mapStateToProps, mapDispatchToProps)(
    AdminContrib
  )
);
