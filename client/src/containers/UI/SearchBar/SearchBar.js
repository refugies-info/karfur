import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import debounce from 'lodash.debounce';
import track from 'react-tracking';
import {withRouter} from 'react-router-dom';

import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import './SearchBar.scss';
import variables from 'scss/colors.scss';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = (suggestion, isArray = false, structures=false) => isArray ? 
  structures ? (suggestion.acronyme || "") + (suggestion.acronyme && suggestion.nom ? " - " : "") + (suggestion.nom || "") : 
  (suggestion.username || "") + (suggestion.username && suggestion.email ? " - " : "") + (suggestion.email || "") : 
  suggestion.titreMarque + (suggestion.titreMarque && suggestion.titreInformatif ? " - " : "") + suggestion.titreInformatif;

export class SearchBar extends React.Component {
  state = {
    showSearch:true,
    value: '',
    suggestions: [],
    selectedResult:{}
  };

  onChange = (_, { newValue }) => this.setState({ value: newValue });
  onSuggestionsFetchRequested = debounce( ({ value }) => this.setState({ suggestions: this.getSuggestions(value) }), 200)
  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = value => {
    const array = this.props.array || this.props.dispositifs || [];
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return [];}
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    return array.filter(child => this.props.isArray ? 
      (regex.test(child.acronyme) || regex.test(child.nom) || child.createNew) || (regex.test(child.username) || regex.test(child.email)) : 
      regex.test(child.titreMarque) || regex.test(child.titreInformatif) || regex.test(child.abstract) || regex.test(child.contact) || (child.tags || []).some(x => regex.test(x)) || (child.audience || []).some(x => regex.test(x)) || (child.audienceAge || []).some(x => regex.test(x)) || this.findInContent(child.contenu, regex) );
  }

  findInContent = (contenu, regex) => contenu.some(x => regex.test(x.title) || regex.test(x.content) || (x.children && x.children.length > 0 && this.findInContent (x.children, regex)) );
  
  onSuggestionSelected = (_,{suggestion}) => {
    this.setState({selectedResult : suggestion});
    this.props.isArray ? this.props.selectItem(suggestion) : this.goToDispositif(suggestion, true);
  }

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  validateSearch = () => this.goToDispositif(this.state.selectedResult, true);
  
  render() {
    const {isArray, structures} = this.props;

    const renderSuggestion = (suggestion, { query }) => {
      if(isArray && suggestion.createNew){
        return (
          <span className='suggestion-content'>
            <span className="name">
              <EVAIcon name="plus-outline" className="mr-10 plus-btn" />
              <i>Créer une nouvelle structure</i>
            </span>
            <span className="float-right mt-10">
              <EVAIcon name="plus-circle-outline" fill={variables.grisFonce} />
            </span>
          </span>
        );
      }else{
        const suggestionText = `${isArray ? structures ? suggestion.acronyme : suggestion.username : suggestion.titreMarque} - ${isArray ? structures ? suggestion.nom : (suggestion.email || "") : suggestion.titreInformatif}`;
        const matches = AutosuggestHighlightMatch(suggestionText, query + ' ' + query);
        const parts = AutosuggestHighlightParse(suggestionText, matches);
        return (
          <span className='suggestion-content'>
            {isArray && suggestion.picture && suggestion.picture.secure_url && 
              <img src={suggestion.picture.secure_url} className="selection-logo mr-10" alt="logo" />}
            <span className="name">
              {parts.map((part, index) => {
                const className = part.highlight ? 'highlight' : null;
                return <span className={className} key={index}>{part.text}</span>;
              })}
            </span>
          </span>
        );
      }
    }

    const inputProps = { placeholder: this.props.placeholder || 'Chercher', value: this.state.value, onChange: this.onChange };
    
    return(
      <div className={"md-form form-sm form-2 pl-0 " + this.props.className + (isArray ? " isArray": "")}>
        <Autosuggest 
          highlightFirstSuggestion
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={s => getSuggestionValue(s, isArray, structures)}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected} 
        />
        {this.props.loupe &&
          <i onClick={this.validateSearch} className="fa fa-search text-grey loupe-btn pointer" aria-hidden="true"/>}
        {this.props.validate && 
          <div className="input-group-append" onClick={this.validateSearch}>
            <span className="input-group-text amber lighten-3" id="basic-text1">
              Valider
            </span>
          </div>}
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    dispositifs: state.dispositif.dispositifs,
  }
}

export default track({
    component: 'SearchBar',
  })(
    withRouter(
      connect(mapStateToProps)(SearchBar)
    )
  );