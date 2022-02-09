import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  FeedbackFooter,
} from "./FeedbackFooter.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const FeedbackFooterContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(FeedbackFooter);
