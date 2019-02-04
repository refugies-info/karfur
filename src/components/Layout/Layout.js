import React from 'react';

import Aux from '../../hoc/Aux';
import './Layout.css';
import i18n from '../../i18n';
import { withNamespaces } from 'react-i18next';

const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
}
const layout = (props) => (
    <Aux>
        <div>
            <button onClick={() => changeLanguage('fr')}>fr</button>
            <button onClick={() => changeLanguage('en')}>en</button>
            <button onClick={() => changeLanguage('ar')}>ar</button>
            <h1>{props.t('Bienvenue')}</h1>
        </div>
        <div>Toolbar, SideDrawer and Backdrop</div>
        <main className="Content">
            {props.children}
        </main>
    </Aux>
)

export default withNamespaces()(layout);