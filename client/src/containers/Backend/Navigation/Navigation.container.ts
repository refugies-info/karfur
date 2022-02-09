import { compose } from "recompose";
import {
  PropsBeforeInjection,
  NavigationComponent,
} from "./Navigation.component";
import { withTranslation } from "next-i18next";
import { TranslationProps } from "react-i18next";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface InjectedProps extends RouteComponentProps, TranslationProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const NavigationContainer = compose<Props, PropsBeforeInjection>(
  withRouter,
  withTranslation()
)(NavigationComponent);

// @ts-ignore
export const Navigation = withRouter(withTranslation()(NavigationComponent));
