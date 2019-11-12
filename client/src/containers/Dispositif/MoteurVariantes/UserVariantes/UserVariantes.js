import React, {Component} from 'react';
import { Row, Col, Input } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import ReactDependentScript from 'react-dependent-script';
import Autocomplete from 'react-google-autocomplete';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

import EVAIcon from '../../../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../../../components/FigmaUI/FButton/FButton';

import "./UserVariantes.scss";
import variables from 'scss/colors.scss';

class UserVariantes extends Component {
  state= {
    age: "",
    ville: "",
    isMounted: false,
    place:{}
  }
  mapRef = React.createRef();
  
  componentDidMount(){
    this.setState({isMounted: true})
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.search){
      if(nextProps.search.age && nextProps.search.age !== this.state.age){
        this.setState({age: nextProps.search.age});
      }
      // if(nextProps.search.ville && nextProps.search.ville !== this.state.ville){//Marche pas trop, injecte le plac_id à la place, chiant de changer
      //   this.setState({ville: nextProps.search.ville});
      // }
    }
  }

  onPlaceSelected = (place) => {
    console.log(place)
    this.setState({ ville: place.formatted_address, place });
  }

  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });

  validateCriteres = () => {
    let query={
      ...(this.state.age !== "" && Number(this.state.age) && {"age": this.state.age}),
      ...(this.state.place.place_id && {"ville": this.state.place.place_id}),
    };
    if(this.state.place.place_id || this.state.age !== ""){
      const searchString = qs.stringify(query);
      this.props.history.push(`?${searchString}`);
      this.props.switchVariante();
    };
  }

  render(){
    const {t, allDemarches, variantes} = this.props;
    const {age, ville, isMounted} = this.state;
    const currCities = variantes.reduce((acc, curr) => [...acc, ...(curr.villes || []).map(x => x.place_id)], []);
    const hasCityVar = allDemarches.some(d => d.variantes.some(va => va.villes.some(vi => !currCities.includes(vi.place_id) )));
    const currAges = variantes.reduce((acc, curr) => [...acc, {bottomValue: curr.bottomValue, topValue: curr.topValue}], []);
    const hasAgesVar = allDemarches.some(d => d.variantes.some(va => !currAges.some(c => c.bottomValue === va.bottomValue && c.topValue === va.topValue  )));
    
    if(hasAgesVar || hasCityVar){
      return(
        <div className="user-variantes">
          <div className="bandeau-haut">
            <EVAIcon name="options-2-outline" fill={variables.noir} className="icone-jaune mr-10" />
            <div className="contenu-bandeau">{t("Dispositif.Personnalisation disponible", "Personnalisation disponible !")}</div>
          </div>
          <div className="bandeau-bas">
            <Row className="negative-margin">
              {hasCityVar && 
                <Col xl="auto" lg="auto" md="auto" sm="12" xs="12" className="mt-10">
                  <b>{t("Dispositif.jhabite", "J’habite à")} :</b>
                  {isMounted && 
                    <ReactDependentScript
                      loadingComponent={<div>Chargement de Google Maps...</div>}
                      scripts={["https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=places&language=fr&region=FR"]}
                    >
                      <Autocomplete
                        ref={this.mapRef}
                        className="criteres-autocomplete"
                        placeholder="Choisir ma ville"
                        id="ville"
                        value={ville}
                        onChange={this.handleChange}
                        onPlaceSelected={this.onPlaceSelected}
                        types={['(regions)']}
                        componentRestrictions={{country: "fr"}}
                      />
                    </ReactDependentScript>}
                </Col>}

              {hasAgesVar && 
                <Col xl="auto" lg="auto" md="auto" sm="12" xs="12" className="mt-10">
                  <b>{t("Dispositif.jai", "J’ai")} :</b>
                  <Input
                    className="criteres-autocomplete text-input mr-10"
                    placeholder="18"
                    id="age"
                    value={age}
                    onChange={this.handleChange}
                  />
                  <b>{t("ans", "ans")}</b>
                </Col>}

              <Col xl="auto" lg="auto" md="auto" sm="12" xs="12" className="mt-10">
                <FButton type="validate" onClick={this.validateCriteres} name="checkmark-circle-outline" fill={variables.noir}>
                  Valider
                </FButton>
              </Col>
            </Row>
          </div>
        </div>
      )
    }else{return false;}
  }
}

export default withRouter(
  withTranslation()(UserVariantes)
);