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
  onSuggestionSelected = (_,{suggestion}) => this.goToDispositif(suggestion, true)

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

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
      <Autosuggest 
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected} />
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