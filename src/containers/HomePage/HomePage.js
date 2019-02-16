import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import LanguageModal from '../../components/UI/LanguageModal/LanguageModal'

import i18n from '../../i18n';
import { withNamespaces } from 'react-i18next';

const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
}

class HomePage extends Component {
    state = {
        showModal: true
    }
    changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        this.setState({showModal:false})
    }
    render(){
        const {t} = this.props;
        const languages=[
            {
                name: 'Français',
                key: 'fr'
            },
            {
                name: 'English',
                key: 'en'
            },
            {
                name: 'العربية',
                key: 'ar'
            }
        ]
        return(
            <Aux>
                <div>
                    <button onClick={() => changeLanguage('fr')}>fr</button>
                    <button onClick={() => changeLanguage('en')}>en</button>
                    <button onClick={() => changeLanguage('ar')}>ar</button>
                    <h1>{this.props.t('Bienvenue')}</h1>
                </div>
                <div>Toolbar, SideDrawer and Backdrop</div>
                <LanguageModal show={this.state.showModal} changeFn={this.changeLanguage} languages={languages}/>
                <div>{t('Elément principal')}</div>
                <div>{t('Elément secondaire')}</div>
                <div>{t('Troisième élément')}</div>
                <div>{t('Quatrième élément')}</div>
            </Aux>
        );
    }
}

export default withNamespaces()(HomePage);