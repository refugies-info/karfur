import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  contenuDispositif,
  PropsBeforeInjection,
} from "./ContenuDispositif.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const ContenuDispositifContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
  //@ts-ignore : contenuDispositif returns an array of jsx element of false which are not valid return type for component
)(contenuDispositif);
