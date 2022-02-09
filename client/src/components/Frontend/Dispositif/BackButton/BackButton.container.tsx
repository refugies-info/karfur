import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import { PropsBeforeInjection, BackButton } from "./BackButton.component";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const BackButtonContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(BackButton);
