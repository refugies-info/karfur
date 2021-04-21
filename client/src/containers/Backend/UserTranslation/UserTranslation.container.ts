import { compose } from "recompose";
import {
  PropsBeforeInjection,
  UserTranslationComponent,
} from "./UserTranslation.component";
import { withTranslation, WithTranslation } from "react-i18next";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const UserTranslationContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(UserTranslationComponent);
