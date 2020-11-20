import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  AnnuaireDetail,
  PropsBeforeInjection,
} from "./AnnuaireDetail.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const AnnuaireDetailContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(AnnuaireDetail);
