import React, {Component} from 'react';
import { Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, Input, DropdownItem } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import ReactDependentScript from 'react-dependent-script';
import Autocomplete from 'react-google-autocomplete';

import FButton from '../../../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../../../components/UI/EVAIcon/EVAIcon';
import {customCriteres} from '../data';

import variables from 'scss/colors.scss';

class UneVariante extends Component {
  state= {
    villes: [], 
    ageTitle: 'De ** à ** ans', 
    bottomValue: 18, 
    topValue:56,
    ville: "",
    validatedRow: new Array(3).fill(false),
    dropdowns:{age: false, criteres: [false]},
    newCriteres: [customCriteres[0]]
  }

  componentDidMount(){
    if(this.props.variantes && this.props.variantes.length > 0){
      const {villes, ageTitle, bottomValue, topValue, ...bprops} = this.props.variantes[0];
      let newCriteres = [], validatedRow = [!!villes && villes.length > 0, !!ageTitle]
      customCriteres.forEach((x,i) => { if(x.query && bprops[x.query]){
        newCriteres = [...newCriteres, {...x, options: x.options.map(y => ({...y, selected: bprops[x.query].includes(y.texte)}))}]
        validatedRow = [...validatedRow, true];
      } })
      if(newCriteres.length === 0){newCriteres = [customCriteres[0]]; validatedRow = [...validatedRow, false];}
      this.setState({
        ...(villes && {villes}), 
        ...(ageTitle && {ageTitle, bottomValue, topValue}), 
        newCriteres, validatedRow,
      })
    }
  }

  onPlaceSelected = (place) => {
    const newVilles = [...this.state.villes, place];
    const filteredNewVilles = [...new Set( newVilles.map(x => x.place_id) )].map(x => newVilles.find(y => y.place_id === x))
    this.setState(pS => ({villes: filteredNewVilles, validatedRow: pS.validatedRow.map((x,i) => i===0 ? true : x), ville: "" }));
  }

  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });
  removeVille = (idx) => this.setState(pS => ({villes: pS.villes.filter((_,i) => i!==idx) }));
  toggleDropdown = (name, idx=null) => this.setState(pS=> ({dropdowns: {...pS.dropdowns, [name]: idx===null ? !pS.dropdowns[name] : pS.dropdowns[name].map((x,i) => i===idx ? !x : x) }}));
  changeCritere = (idx, target) => this.setState(pS => ({newCriteres: pS.newCriteres.map((x,i) => i===target ? customCriteres[idx] : x) }));
  selectCritere = (idx, target) => this.setState(pS => ({newCriteres: pS.newCriteres.map((x,i) => i===target ? {...x, options: x.options.map((y,j) => j===idx ? {...y, selected: !y.selected} : y )} : x)}), ()=>this.setState(pS => ({validatedRow: pS.validatedRow.map((x,i) => i===target+2 ? this.state.newCriteres[target].options.map(x => x.selected || false).includes(true) : x) })) )
  changeTitle = (idx, value) => this.setState(pS => ({ageTitle: value, validatedRow: pS.validatedRow.map((x,i) => i===1 ? idx > 0 : x) }));

  changeAge = (e, isBottom=true) => {
    e.persist();
    this.setState(pS => ({[isBottom ? "bottomValue" : "topValue"]: ((e.target || {}).value || "").replace(/\D/g, ''), validatedRow: pS.validatedRow.map((x,i) => i===1 ? true : x) } ));
  }

  addCritere = () => this.setState(pS => ({
      newCriteres: [...pS.newCriteres, customCriteres[0]],
      dropdowns:{...pS.dropdowns, criteres: [...pS.dropdowns.criteres, false]},
      validatedRow: [...pS.validatedRow, false],
    }))

  validateCriteres = () => {
    const {villes, ageTitle, bottomValue, topValue, validatedRow} = this.state;
    let newVariante = {
      ...(validatedRow[0] && {villes}),
      ...(validatedRow[1] && {ageTitle, bottomValue, topValue}),
    }
    validatedRow.forEach((x,i) => { if(i>1 && x){
        newVariante[this.state.newCriteres[i-2].query] = this.state.newCriteres[i-2].options.filter(y=>y.selected).map(y => y.texte);
    } })
    console.log(newVariante)
    this.props.validateVariante(newVariante);
    this.props.toggleVue();
  }

  render(){
    const {filtres} = this.props;
    const {villes, ageTitle, bottomValue, topValue, ville, validatedRow, newCriteres} = this.state;
    return(
      <>
        <Row className="moteur-row">
          <Col lg="12">
            <div className="col-body">

              <div className={"critere mb-10" + (validatedRow[0] ? " validated" : "")}>
                <h5 className="critere-title">
                  <EVAIcon name="pin-outline" fill={variables.noir} className="mr-10" />
                  Localisation
                </h5>
                <div className={"critere-body" + (villes.length === 0 ? " justify-content-space-between" : "")}>
                  {villes.length === 0 && 
                    <span className="color-grisFonce">Cette démarche s’applique aux habitants de :</span>}

                  <ReactDependentScript
                    loadingComponent={<div>Chargement de Google Maps...</div>}
                    scripts={["https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=places&language=fr&region=FR"]}
                  >
                  <span>lkjnfd</span>
                    {/* <Autocomplete
                      className="criteres-autocomplete"
                      placeholder="Nantes, Paris..."
                      id="ville"
                      value={ville}
                      onChange={this.handleChange}
                      onPlaceSelected={this.onPlaceSelected}
                      types={['(regions)']}
                      componentRestrictions={{country: "fr"}}
                    /> */}
                  </ReactDependentScript>

                  {villes.map((ville, key) => (
                    <div className="selected-ville ml-10" key={ville.place_id}>
                      <span>{ville.formatted_address}</span>
                      <EVAIcon name="close-outline" className="ml-10 cursor-pointer" onClick={()=> this.removeVille(key)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={"critere mb-10" + (validatedRow[1] ? " validated" : "")}>
                <h5 className="critere-title">
                  <EVAIcon name="people-outline" fill={variables.noir} className="mr-10" />
                  Tranche d’âge
                </h5>
                <div className="critere-body justify-content-space-between">
                  <span className="color-grisFonce">Cette variante s’applique aux personnes qui ont : </span>
                  
                  <ButtonDropdown isOpen={this.state.dropdowns.age} toggle={()=>this.toggleDropdown("age")} className="content-title">
                    <DropdownToggle caret>
                      {ageTitle.split("**").map((x, i, arr) => (
                        <React.Fragment key={i}>
                          <span>{x}</span>
                          {i < arr.length - 1 && 
                            <Input 
                              type="number" 
                              className="age-input"
                              value={((arr[0] === "De " && i===0) || arr[0] === "Plus de ") ? bottomValue : topValue} 
                              onClick={e => e.stopPropagation()}
                              // onMouseUp={() => (this.props.subitem || {}).isFakeContent && this.props.changeAge({target:{value:""}}, this.props.keyValue, this.props.subkey, i===0 || arr[0] === "Plus de")}
                              onChange={e => this.changeAge(e, (arr[0] === "De " && i===0) || arr[0] === "Plus de ")} />}
                        </React.Fragment>
                      ))}
                    </DropdownToggle>
                    <DropdownMenu>
                      {["Tout âge confondu", ...filtres.audienceAge].map((option, key) => (
                        <DropdownItem key={key} onClick={()=>this.changeTitle(key, option)}>
                          {option}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
              
              {newCriteres.map((customCritere, idx) => (
                <div className={"critere mb-10" + (validatedRow[idx+2] ? " validated" : "")} key={idx}>
                  <ButtonDropdown isOpen={this.state.dropdowns.criteres[idx]} toggle={()=>this.toggleDropdown("criteres", idx)} className="content-title">
                    <h5 className="mb-20">
                      <DropdownToggle caret>
                        <EVAIcon name="options-2-outline" fill={variables.noir} className="mr-10" />
                        {customCritere.texte}
                      </DropdownToggle>
                    </h5>
                    <DropdownMenu>
                      {customCriteres.map((option, key) => (
                        <DropdownItem key={key} onClick={()=>this.changeCritere(key, idx)}>
                          {option.texte}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                  <div className="critere-body justify-content-space-between">
                    <span className="color-grisFonce">{customCritere.displayText}</span>
                    <div className="critere-options">
                      {customCritere.options.map((option, key) => (
                        <FButton 
                          type="light-action" 
                          key={key} 
                          className={"ml-10 custom-critere-btn" + (option.selected ? " active" : "")}
                          onClick={()=>this.selectCritere(key, idx)}
                        >
                          {option.texte}
                        </FButton>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="critere add-critere cursor-pointer" onClick={this.addCritere}>
                <div className="critere-body">
                  <EVAIcon name="plus-circle-outline" fill={variables.grisFonce} className="mr-10" />
                  <span className="color-grisFonce">
                    Ajouter un critère supplémentaire
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="footer-btns mt-10">
          <FButton type="help" name="question-mark-circle-outline" fill={variables.error} onClick={this.props.upcoming}>
            J'ai besoin d'aide
          </FButton>
          <FButton 
            type="validate" 
            name="checkmark-outline" 
            onClick={this.validateCriteres}
            fill={variables.noir} 
            disabled={!validatedRow.includes(true)}>
            Valider
          </FButton>
        </div>
      </>
    )
  }
}

export default withTranslation()(UneVariante);