import React from "react";
// import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";

import FButton from "../../FigmaUI/FButton/FButton";

import "./UnauthorizedAccess.scss";
import {colors} from "colors";

const unauthorizedAccess = (props) => (
  <div className="unauthorized-access">
    <h3>{props.t("UnauthorizedAccess.Accès refusé", "Accès refusé")}</h3>
    <FButton
      tag={NavLink}
      to="/"
      fill={colors.noir}
      name="arrow-back-outline"
    >
      {props.t("UnauthorizedAccess.Revenir à l'accueil", "Revenir à l'accueil")}
    </FButton>
  </div>
);

export default withTranslation()(unauthorizedAccess);
