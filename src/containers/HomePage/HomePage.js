import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import { withNamespaces } from 'react-i18next';

class HomePage extends Component {
    render(){
        const {t} = this.props;
        return(
            <Aux>
                <div>{t('Elément principal')}</div>
                <div>{t('Elément secondaire')}</div>
                <div>{t('Troisième élément')}</div>
            </Aux>
        );
    }
}

export default withNamespaces()(HomePage);