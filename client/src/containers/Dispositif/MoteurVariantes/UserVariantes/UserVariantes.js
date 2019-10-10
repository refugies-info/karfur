import React, {Component} from 'react';
import { Row, Col, Input } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import ReactDependentScript from 'react-dependent-script';
import Autocomplete from 'react-google-autocomplete';
import { withRouter } from 'react-router-dom';
import 'url-search-params-polyfill';

import EVAIcon from '../../../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../../../components/FigmaUI/FButton/FButton';

import "./UserVariantes.scss";
import variables from 'scss/colors.scss';

class UserVariantes extends Component {
  state= {
    age: "",
    ville: "",
  }
  
  onPlaceSelected = (place) => {
    console.log(place)
    this.updateURL("ville", place.place_id)
    this.setState({ ville: place.formatted_address });
  }

  handleChange = (e) => this.setState({ [e.currentTarget.id]: e.target.value });
  
  updateURL = (target, value) => {
    const url = setParams({target, value});
    this.props.history.push(`?${url}`);
//     audienceAge.bottomValue: {$lt: 56}
// audienceAge.topValue: {$gt: 25}
  };

  validateCriteres = () => {
    this.updateURL("age", this.state.age)
  }

  render(){
    const {t} = this.props;
    const {age, ville} = this.state;
    return(
      <div className="user-variantes">
        <div className="bandeau-haut">
          <EVAIcon name="options-2-outline" fill={variables.noir} className="icone-jaune mr-10" />
          <div className="contenu-bandeau">{t("Dispositif.Personnalisation disponible", "Personnalisation disponible !")}</div>
        </div>
        <div className="bandeau-bas">
          <Row>
            <Col lg="auto">
              <b>{t("Dispositif.jhabite", "J’habite à")} :</b>
              <ReactDependentScript
                loadingComponent={<div>Chargement de Google Maps...</div>}
                scripts={["https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=places&language=fr&region=FR"]}
              >
                <Autocomplete
                  className="criteres-autocomplete"
                  placeholder="Choisir ma ville"
                  id="ville"
                  value={ville}
                  onChange={this.handleChange}
                  onPlaceSelected={this.onPlaceSelected}
                  types={['(regions)']}
                  componentRestrictions={{country: "fr"}}
                />
              </ReactDependentScript>
            </Col>

            <Col lg="auto">
              <b>{t("Dispositif.jai", "J’ai")} :</b>
              <Input
                className="criteres-autocomplete text-input mr-10"
                placeholder="18"
                id="age"
                value={age}
                onChange={this.handleChange}
              />
              <b>{t("ans", "ans")}</b>
            </Col>

            <Col lg="auto">
              <FButton type="validate" onClick={this.validateCriteres} name="checkmark-circle-outline" fill={variables.noir}>
                Valider
              </FButton>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

function setParams({ target = "query", value = ""}) {
  const searchParams = new URLSearchParams();
  searchParams.set(target, value);
  return searchParams.toString();
}

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);
  return {
    query: searchParams.get('query') || '',
  };
}

export default withRouter(
  withTranslation()(UserVariantes)
);