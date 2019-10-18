import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Table } from 'reactstrap';
import {NavLink} from 'react-router-dom'; 
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment/min/moment-with-locales';

import API from '../../../utils/API';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import {fetch_dispositifs} from '../../../Store/actions';
import {deleteContrib} from '../UserProfile/functions';
import { colorStatut } from '../../../components/Functions/ColorFunctions';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import {table_contenu} from './data';
import { prepareDeleteContrib } from '../AdminContrib/functions';
import { customCriteres } from '../../Dispositif/MoteurVariantes/data';

import './AdminContenu.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

class AdminContenu extends Component {
  constructor(props) {
    super(props);
    this.deleteContrib = deleteContrib.bind(this);
    this.prepareDeleteContrib = prepareDeleteContrib.bind(this);
  }

  state={
    compressedDispos: [],
  };

  componentDidMount (){
    if(this.props.dispositifs.length > 0){
      this._initializeContrib(this.props);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dispositifs.length !== this.props.dispositifs.length){
      this._initializeContrib(nextProps);
    }
  }

  _initializeContrib = (props) => {
    this.setState({
      compressedDispos: props.dispositifs
        .filter(x => !x.demarcheId)
        .map(x => ({
          ...x, 
          expanded: false, 
          type:"parent", 
          children: props.dispositifs
            .filter(y => y.demarcheId === x._id)
            .map(y => ({
              ...y, 
              titreInformatif: [
                y.titreInformatif, 
                "-", 
                y.variantes.map(z => 
                  ["(", 
                  ...(z.ageTitle ? ["Âge : " + ((z.ageTitle === 'De ** à ** ans') ? "De" + ' ' + z.bottomValue + ' ' + "à" + ' ' + z.topValue  + ' ' + "ans" :
                    (z.contentTitle === 'Moins de ** ans') ? "Moins de" + ' ' + z.topValue + ' ' + "ans" :
                      "Plus de" + ' ' + z.bottomValue + ' ' + "ans") + ", " ] : []),
                  ...(z.villes ? ["Localisation : " + (z.villes.length>1 ? (z.villes.length + " villes") : z.villes[0].formatted_address) + ", " ] : []),
                  customCriteres.reduce((acc,curr) => acc += curr.query && z[curr.query] ? (curr.texte + " : " + z[curr.query].join(" ou ") + ", ") : "", "").slice(0, -2),
                  ")"].join(" ")
                ).join(" ou ")
              ].join(" "), 
            }) 
        )} 
      )) 
    })
  }

  toggleExpanded = idx => {
    let compressedDispos = [...this.state.compressedDispos].map((x,i)=> i===idx ? [{...x, expanded: !x.expanded}, ...( !x.expanded ? x.children.map(y=> ({...y, type: "child", children: []})) : [] ) ] : [x]).reduce((a, b) => a.concat(b), []);
    if(this.state.compressedDispos[idx].expanded){
      compressedDispos = compressedDispos.filter(x => x.demarcheId !== this.state.compressedDispos[idx]._id);
    }
    this.setState({compressedDispos})
  }

  render() {
    const {structures} = this.props;
    const {compressedDispos} = this.state;
    return (
      <div className="admin-contenu animated fadeIn">
        <Table responsive className="avancement-user-table">
          <thead>
            <tr>
              {table_contenu.headers.map((element,key) => (<th key={key} className={table_contenu.hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
            </tr>
          </thead>
          <tbody>
            {compressedDispos.map((element,key) => {
              const titre = (element.titreMarque || "") + (element.titreMarque && element.titreInformatif ? " - " : "") + (element.titreInformatif || "");
              const  structure = (structures || []).find(x => x._id === element.mainSponsor) || {};
              return (
                <tr key={key}>
                  <td className="align-middle" onClick={()=>(element.children || []).length > 0 && this.toggleExpanded(key)}>
                    {(element.children || []).length > 0 && 
                      <EVAIcon 
                        name={"chevron-" + (element.expanded ? "down" : "right") + "-outline"} 
                        fill={variables.noir} 
                        className="mr-10" />}
                    <span className={(element.children || []).length === 0 ? ((element.type==="child" ? "super-" : "") + "decale-gauche") : ""}>{titre}</span>
                  </td>
                  <td className="align-middle">
                    <div className={"status-pill bg-"+colorStatut(element.status)}>{element.status}</div>
                  </td>
                  <td className="align-middle hideOnPhone">
                    {(element.children || []).length || 0}
                  </td>
                  <td className="align-middle">
                    {moment(element.updatedAt).fromNow()}
                  </td>
                  <td className="align-middle">
                    {structure.acronyme || structure.nom}
                  </td>
                  <td className="align-middle pointer fit-content">
                    <FButton type="light-action" name="trash-2-outline" fill={variables.noir} onClick={e => this.prepareDeleteContrib(element)} />
                  </td>
                  <td className="align-middle">
                    <FButton tag={NavLink} to={"/" + (element.typeContenu || "dispositif") + "/"+ element._id} type="light-action" name="eye-outline" fill={variables.noir} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dispositifs: state.dispositif.dispositifs,
    structures: state.structure.structures,
  }
}

const mapDispatchToProps = {fetch_dispositifs};

export default track({
  page: 'AdminContenu',
})(
  connect(mapStateToProps, mapDispatchToProps)(
    AdminContenu
  )
);
