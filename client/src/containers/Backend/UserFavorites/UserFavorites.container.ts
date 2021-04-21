import { compose } from "recompose";
import {
  PropsBeforeInjection,
  UserFavoritesComponent,
} from "./UserFavorites.component";
import { withTranslation, WithTranslation } from "react-i18next";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const UserFavoritesContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(UserFavoritesComponent);
