import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  FrenchLevelModalComponent,
} from "./FrenchLevelModal.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const FrenchLevelModalContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(FrenchLevelModalComponent);
