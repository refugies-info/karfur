import { compose } from "recompose";
import {
  PropsBeforeInjection,
  UserProfileComponent,
} from "./UserProfile.component";
import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const UserProfileContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(UserProfileComponent);
