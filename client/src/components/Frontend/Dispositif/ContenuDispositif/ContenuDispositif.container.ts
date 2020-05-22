import { withTranslation, WithTranslation } from "react-i18next";
import {
  contenuDispositif,
  PropsBeforeInjection,
} from "./ContenuDispositif.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

//@ts-ignore : contenuDispositif returns an array of jsx element of false which are not valid return type for component
export const ContenuDispositifContainer = withTranslation()(contenuDispositif);
