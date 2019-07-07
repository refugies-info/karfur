import React from 'react';
import {withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { AppAsideToggler } from '@coreui/react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import debounce from 'lodash.debounce';

import {toggle_lang_modal} from '../../../Store/actions/index';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import API from '../../../utils/API';
import AudioBtn from '../../../containers/UI/AudioBtn/AudioBtn';
import marioProfile from '../../../assets/mario-profile.jpg';
import Logo from '../../Logo/Logo';
import LanguageBtn from '../../FigmaUI/LanguageBtn/LanguageBtn';

import './Toolbar.scss';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = suggestion => suggestion.titreMarque + " - " + suggestion.titreInformatif;

export class Toolbar extends React.Component {

  state = {
    dropdownOpen: false,
    showSearch:false,
    value: '',
    suggestions: [],
  };
  
  _toggleSearch = () => {this.setState(prevState=> ({showSearch: !prevState.showSearch}))}

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

  disconnect = () => {
    API.logout();
    this.props.history.push('/')
  }

  toggle = () => this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));

  navigateTo = route => this.props.history.push(route)

  render() {
    const path = this.props.location.pathname;
    const { i18n, user, contributeur, traducteur } = this.props;
    let { showSearch } = this.state;
    let afficher_burger=path.includes("/backend");
    let afficher_burger_droite=path.includes("/traduction");
    
    let userImg = (user.picture || {}).secure_url || marioProfile;

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
      <header className="Toolbar">
        <div className="left_buttons">
          <DrawerToggle 
            forceShow={false && afficher_burger}
            clicked={()=>this.props.drawerToggleClicked('left')} />
          <Logo />
          <AudioBtn />
          <LanguageBtn />
        </div>

        <nav className="DesktopOnly center_buttons">
          <NavigationItems />
        </nav>

        <div className="md-form form-sm form-1 pl-0 search-bar inner-addon right-addon">
          {showSearch && 
            <Autosuggest 
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={this.onSuggestionSelected} />}
          <i onClick={this._toggleSearch} className={"fa fa-search text-grey search-btn pointer" + (showSearch ? "" : " icon-only")} aria-hidden="true"></i>
        </div>

        <div className="right_buttons">
          <Button tag={NavLink} to={ API.isAuth() ? "/backend/user-dashboard" : { pathname: '/login', state: {traducteur: true, redirectTo:"/backend/user-dashboard"} }} className="traduire-btn">
            Traduire
          </Button>

          {API.isAuth() ? 
            <ButtonDropdown className="user-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle color="transparent">
                <img src={userImg} className="user-picture" />
                <div className="user-badge" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={()=>this.navigateTo("/backend/user-profile")}>Mon profil</DropdownItem>
                {contributeur && <DropdownItem onClick={()=>this.navigateTo("/backend/user-dash-contrib")}>Mon univers contribution</DropdownItem>}
                {traducteur && <DropdownItem onClick={()=>this.navigateTo("/backend/user-dashboard")}>Mon univers traduction</DropdownItem>}
                <DropdownItem divider />
                <DropdownItem onClick={this.disconnect} className="text-danger">Se déconnecter</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            :
            <NavLink to={{ pathname:'/login', state: { redirectTo: "/backend/user-profile" } }}>
              <Button color="white" className="connect-btn">
                Connexion
              </Button>
            </NavLink>
          }
        </div>
        
        {false && afficher_burger_droite &&
          <AppAsideToggler
            className="d-md-down-none" />
        }
      </header>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    langues: state.langue.langues,
    dispositifs: state.dispositif.dispositifs,
    user: state.user.user,
    traducteur: state.user.traducteur,
    contributeur: state.user.contributeur,
  }
}

const mapDispatchToProps = {toggle_lang_modal};

export default track({
  component: 'Toolbar',
})(
  withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
      withTranslation()(Toolbar)
    )
  )
);