import React from 'react';
import {NavLink} from 'react-router-dom';

import FButton from '../../FigmaUI/FButton/FButton';

import './UnauthorizedAccess.scss'
import variables from 'scss/colors.scss';

const unauthorizedAccess = (props) => (
  <div className="unauthorized-access">
    <h3>Accès refusé</h3>
    <FButton tag={NavLink} to="/" fill={variables.noir} name="arrow-back-outline">
      Revenir à l'accueil
    </FButton>
  </div>
)

export default unauthorizedAccess;