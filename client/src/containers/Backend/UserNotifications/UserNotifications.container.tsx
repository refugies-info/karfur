import { compose } from "recompose";
import {
  PropsBeforeInjection,
  UserNotificationsComponent,
} from "./UserNotifications.component";
import { withTranslation, WithTranslation } from "react-i18next";

interface InjectedProps extends WithTranslation {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const UserNotificationsContainer = compose<Props, PropsBeforeInjection>(
  withTranslation()
)(UserNotificationsComponent);
