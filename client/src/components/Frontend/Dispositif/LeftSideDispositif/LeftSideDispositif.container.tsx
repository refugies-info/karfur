import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  LeftSideDispositif,
} from "./LeftSideDispositif.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const LeftSideDispositifContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(LeftSideDispositif);
