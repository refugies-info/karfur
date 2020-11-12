import { compose } from "recompose";
import {
  PropsBeforeInjection,
  AnnuaireLectureComponent,
} from "./AnnuaireLecture.component";
import { withTranslation, WithTranslation } from "react-i18next";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const AnnuaireLectureContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(AnnuaireLectureComponent);
