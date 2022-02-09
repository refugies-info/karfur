import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  CardParagraphe,
} from "./CardParagraphe.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const CardParagrapheContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(CardParagraphe);
