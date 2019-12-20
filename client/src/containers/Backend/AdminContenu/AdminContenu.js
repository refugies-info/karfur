import React, { Component } from 'react';
import track from 'react-tracking';
import { Table, Input, Tooltip } from 'reactstrap';
import {NavLink} from 'react-router-dom'; 
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales';
import _ from "lodash";
import Swal from 'sweetalert2';

import FButton from '../../../components/FigmaUI/FButton/FButton';
import {fetch_dispositifs} from '../../../Store/actions';
import {deleteContrib} from '../UserProfile/functions';
import { colorStatut } from '../../../components/Functions/ColorFunctions';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import {table_contenu, status_mapping, responsables, internal_actions, status_sort_arr} from './data';
import { prepareDeleteContrib } from '../AdminContrib/functions';
import { customCriteres } from '../../Dispositif/MoteurVariantes/data';
import API from '../../../utils/API';

import './AdminContenu.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

const maxDescriptionLength=30;
class AdminContenu extends Component {
  constructor(props) {
    super(props);
    this.deleteContrib = deleteContrib.bind(this);
    this.prepareDeleteContrib = prepareDeleteContrib.bind(this);
  }

  state={
    dispositifs: [],
    headers: table_contenu.headers,
  };

  componentDidMount (){
    this._initializeContrib(this.props);
  }

  _initializeContrib = () => {
    API.get_dispositif({query:{}, sort: {updatedAt: -1}, populate: 'creatorId mainSponsor'}).then(data_res => {
      const dispositifs=[...data_res.data.data];
      this.setState({
        dispositifs: dispositifs
          .filter(x => !x.demarcheId)
          .map(x => ({
            ...x, 
            titreCourt: (x.titreMarque || x.titreInformatif || ""),
            titre: (x.titreMarque || "") + (x.titreMarque && x.titreInformatif ? " - " : "") + (x.titreInformatif || ""),
            structure: _.get(x, "mainSponsor.acronyme", _.get(x, "mainSponsor.nom", "")),
            structureObj: _.get(x, "mainSponsor", {}),
            expanded: false, 
            type:"parent", 
            tooltip: false,
            joursDepuis: (new Date().getTime() -  new Date(x.updatedAt).getTime()) / (1000 * 3600 * 24),
            children: dispositifs
              .filter(y => y.demarcheId === x._id)
              .map(y => ({
                ...y, 
                structure: _.get(y, "mainSponsor.acronyme", _.get(y, "mainSponsor.nom", "")),
                structureObj: _.get(y, "mainSponsor", {}),
                tooltip: false,
                joursDepuis: (new Date().getTime() -  new Date(y.updatedAt).getTime()) / (1000 * 3600 * 24),
                titre: [
                  y.titreInformatif, 
                  "-", 
                  y.variantes.map(z => 
                    ["(", 
                    ...(z.ageTitle ? ["Âge : " + ((z.ageTitle === 'De ** à ** ans') ? "De " + z.bottomValue + " à " + z.topValue  + " ans" :
                      (z.contentTitle === 'Moins de ** ans') ? "Moins de " + z.topValue + " ans" :
                        "Plus de " + z.bottomValue + " ans") + ", " ] : []),
                    ...(z.villes ? ["Localisation : " + (z.villes.length>1 ? (z.villes.length + " villes") : z.villes[0].formatted_address) + ", " ] : []),
                    customCriteres.reduce((acc,curr) => acc += curr.query && z[curr.query] ? (curr.texte + " : " + z[curr.query].join(" ou ") + ", ") : "", "").slice(0, -2),
                    ")"].join(" ")
                  ).join(" ou ")
                ].join(" "), 
              }) 
          )} 
        ))
      })
    })
  }

  toggleExpanded = idx => {
    let dispositifs = [...this.state.dispositifs].map((x,i)=> i===idx ? [{...x, expanded: !x.expanded}, ...( !x.expanded ? x.children.map(y=> ({...y, type: "child", children: []})) : [] ) ] : [x]).reduce((a, b) => a.concat(b), []);
    if(this.state.dispositifs[idx].expanded){
      dispositifs = dispositifs.filter(x => x.demarcheId !== this.state.dispositifs[idx]._id);
    }
    this.setState({dispositifs})
  }

  reorder = (key, element) => {
    const croissant = !element.croissant;
    this.setState(pS => ({dispositifs: pS.dispositifs.sort((a,b)=> {
      let aValue = _.get(a, element.order), bValue = _.get(b, element.order);
      if(element.order === "status"){
        aValue = _.indexOf(status_sort_arr, aValue);
        bValue = _.indexOf(status_sort_arr, bValue);
      }
      return aValue > bValue ? (croissant ? 1 : -1) : aValue < bValue ? (croissant ? -1 : 1) : 0;
    }), headers: pS.headers.map((x,i) => i===key ? {...x, croissant: !x.croissant, active: true} : {...x, active: false})}))
  }

  toggleTooltip = (idx) => this.setState(pS => ({dispositifs: pS.dispositifs.map((x,i) => i===idx ? {...x, tooltip: !x.tooltip} : x) })); 

  handleChange = (e, idx, dispositif) => {
    const target = e.target;
    const newDispositif = { [target.id]: target.value, dispositifId: dispositif._id, status: dispositif.status };
    API.add_dispositif(newDispositif);
    this.setState(pS => ({
      dispositifs: pS.dispositifs.map((x,i) => i===idx ? {...x, [target.id]: target.value} : x),
    }));
  }

  update_status = async (dispositif, status="Actif") => {
    const newDispositif = { status: status, dispositifId: dispositif._id };
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
        this.setState(pS => ({ dispositifs: pS.dispositifs.map(x => x._id === dispositif._id ? {...x, status: status} : x) }));
      });
    }
  }

  render() {
    const {dispositifs, headers} = this.state;
    return (
      <div className="admin-contenu animated fadeIn">
        <Table responsive className="avancement-user-table">
          <thead>
            <tr>
              {headers.map((element,key) => (
                <th 
                  key={key} 
                  className={(element.active ? "texte-bold" : "") + (element.hideOnPhone ? " hideOnPhone" : "") + " cursor-pointer"}
                  onClick={()=>this.reorder(key, element)} 
                >
                  {element.name}
                  {element.order &&
                    <EVAIcon 
                      name={"chevron-" + (element.croissant ? "up" : "down") }
                      fill={variables.noir} 
                      className="sort-btn"
                    />}
                </th> 
              ))}
            </tr>
          </thead>
          <tbody>
            {dispositifs.map((element,key) => {
              const bgColor = (status_mapping.find(x => x.name === element.status) || {}).color || "";
              return (
                <tr key={key} className={bgColor ? ("bg-" + bgColor) : ""} >
                  <td 
                    className="align-middle"
                    onClick={()=>(element.children || []).length > 0 && this.toggleExpanded(key)}
                  >
                    {(element.children || []).length > 0 && 
                      <EVAIcon 
                        name={"chevron-" + (element.expanded ? "down" : "right") + "-outline"} 
                        fill={variables.noir} 
                        className="mr-10" />}
                    <span className={(element.children || []).length === 0 ? ((element.type==="child" ? "super-" : "") + "decale-gauche") : ""}>
                      {element.typeContenu || "dispositif"}
                    </span>
                  </td>
                  <td className="align-middle" id={"titre-" + key}>
                    <NavLink to={"/" + (element.typeContenu || "dispositif") + "/"+ element._id}>
                      {element.titreCourt.substring(0, Math.min(element.titreCourt.length, maxDescriptionLength)) + (element.titreCourt.length > maxDescriptionLength ? '...' : '')}
                    </NavLink>
                  </td>
                  <td className="align-middle cursor-pointer" onClick={() => this.props.onSelect({structure: element.structureObj}, "1")}>
                    {element.structure}
                  </td>
                  <td 
                    className={"align-middle petit-texte depuis color-" + (
                      element.status === "Actif" ? "focus" : 
                        element.joursDepuis > 30 ? "rouge" : 
                          element.joursDepuis > 10 ? "orange" : "vert"
                    )}
                  >
                    {element.status === "Actif" ? "Publié" : moment(element.updatedAt).fromNow()}
                  </td>
                  <td className="align-middle">
                    <div className={"status-pill bg-" + colorStatut(element.status)}>{element.status}</div>
                  </td>
                  <td className="align-middle hideOnPhone">
                    <Input 
                      type="select" 
                      id="responsable" 
                      value={element.responsable || ""}
                      onChange = {e => this.handleChange(e, key, element)}  
                    >
                      <option value={""} key={-1}>Aucun</option>
                      {responsables.map((respo, i) =>
                        <option 
                          value={respo}
                          key={i}
                        >
                          {respo}
                        </option>
                      )}
                    </Input>
                  </td>
                  <td className="align-middle hideOnPhone">
                    <Input 
                      type="select" 
                      id="internal_action" 
                      value={element.internal_action || ""}
                      onChange = {e => this.handleChange(e, key, element)}  
                    >
                      <option value={""} key={-1}>Aucun</option>
                      {internal_actions.map((action, i) =>
                        <option 
                          value={action}
                          key={i}
                        >
                          {action}
                        </option>
                      )}
                    </Input>
                  </td>
                  <td className="align-middle hideOnPhone">
                    {(element.children || []).length || 0}
                  </td>
                  <td className="align-middle pointer fit-content">
                    <FButton type="error" name="trash-outline" onClick={() => this.prepareDeleteContrib(element)} />
                  </td>
                  <td className="align-middle">
                    <FButton tag={NavLink} to={"/" + (element.typeContenu || "dispositif") + "/"+ element._id} type="light-action" name="eye-outline" fill={variables.noir} />
                  </td>
                  <td className="align-middle">
                    <FButton type="validate" name="checkmark-outline" fill={variables.noir} onClick={()=>this.update_status(element)} />
                  </td>
                  <Tooltip target={"titre-" + key} isOpen={element.tooltip} toggle={() => this.toggleTooltip(key)}>
                    {element.titre}
                  </Tooltip>
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
