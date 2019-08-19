import React, { Component } from 'react';
import track from 'react-tracking';
import { Button, Card, CardHeader, CardBody, Badge, Collapse, Table} from 'reactstrap';
import {NavLink} from 'react-router-dom'; 
import { connect } from 'react-redux';

import API from '../../../utils/API';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import {fetch_dispositifs} from '../../../Store/actions/index';

import './AdminContrib.scss';
import variables from 'scss/colors.scss';

const reviews_data=["En attente admin", "Rejeté structure", "En attente"]

class AdminContrib extends Component {
  state={
    dispositifs:[],
    accordion: [true, false, false],
  };

  componentDidMount (){
    API.get_dispositif({},{},'creatorId mainSponsor').then(data_res => {
      let dispositifs=[...data_res.data.data];
      console.log(dispositifs);
      this.setState({ dispositifs });
    })
  }


  toggleAccordion = tab => this.setState(pS => ({ accordion: pS.accordion.map( (x,i) => tab === i ? !x : false )} ));

  update_status = (dispositifId, status="Actif") => {
    let dispositif = { status: status, dispositifId: dispositifId };
    API.add_dispositif(dispositif).then(() => {
      this.props.fetch_dispositifs();
      this.setState(pS => ({ dispositifs: pS.dispositifs.map(x => x._id === dispositifId ? {...x, status: status} : x) }));
    });
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
                const arr = dispositifs.filter(x => x.status===status) || [];
                return (
                  <Card className="mb-0" key={index}>
                    <CardHeader id="headingOne">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={accordion[index]} aria-controls="collapseOne">
                        {status}
                        <div className="card-header-actions">
                          <Badge color="alert" className="float-right">{arr.length}</Badge>
                        </div>
                      </Button>
                    </CardHeader>
                    <Collapse isOpen={accordion[index] && arr.length > 0} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                      <CardBody>
                        <Table responsive className="avancement-user-table">
                          <thead> <tr> <th>Titre</th> <th>Structure</th> <th>Voir</th> <th>Valider</th> </tr> </thead>
                          <tbody>
                            {arr.map((element,key) => {
                              return (
                                <tr key={key} >
                                  <td className="align-middle">
                                    <b>{element.titreMarque + ' - ' + element.titreInformatif}</b>
                                  </td>
                                  <td className="align-middle">
                                    {(element.mainSponsor || {}).acronyme}
                                  </td>
                                  <td className="align-middle fit-content">
                                    <FButton tag={NavLink} to={"/dispositif/"+element._id} type="light-action" name="eye-outline" fill={variables.noir} />
                                  </td>
                                  <td className="align-middle fit-content">
                                    <FButton type="validate" name="checkmark-circle-outline" onClick={()=>this.update_status(element._id)}>
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
  connect(mapStateToProps, mapDispatchToProps)
    (AdminContrib)
  );
