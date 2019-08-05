import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import debounce from 'lodash.debounce';
import track from 'react-tracking';
import {withRouter} from 'react-router-dom';

import './SearchBar.scss';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = suggestion => suggestion.titreMarque + " - " + suggestion.titreInformatif;

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
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return [];}
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    return this.props.dispositifs.filter(dispositif => regex.test(dispositif.titreMarque) || regex.test(dispositif.titreInformatif) || regex.test(dispositif.abstract) || regex.test(dispositif.contact) || (dispositif.tags || []).some(x => regex.test(x)) || (dispositif.audience || []).some(x => regex.test(x)) || (dispositif.audienceAge || []).some(x => regex.test(x)) || this.findInContent(dispositif.contenu, regex) );
  }

  findInContent = (contenu, regex) => contenu.some(x => regex.test(x.title) || regex.test(x.content) || (x.children && x.children.length > 0 && this.findInContent (x.children, regex)) );
  
  onSuggestionSelected = (_,{suggestion}) => {
    this.setState({selectedResult : suggestion});
    this.goToDispositif(suggestion, true);
  }

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  validateSearch = () => this.goToDispositif(this.state.selectedResult, true);
  
  render() {
    const renderSuggestion = (suggestion, { query }) => {
      const suggestionText = `${suggestion.titreMarque} - ${suggestion.titreInformatif}`;
      const matches = AutosuggestHighlightMatch(suggestionText, query + ' ' + query);
      const parts = AutosuggestHighlightParse(suggestionText, matches);
      return (
        <span className={'suggestion-content'}>
          <span className="name">
            {parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;
              return <span className={className} key={index}>{part.text}</span>;
            })}
          </span>
        </span>
      );
    }

    const inputProps = { placeholder: 'Chercher', value: this.state.value, onChange: this.onChange };
    
    return(
      <div className={"md-form form-sm form-2 pl-0 " + this.props.className}>
        <Autosuggest 
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
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