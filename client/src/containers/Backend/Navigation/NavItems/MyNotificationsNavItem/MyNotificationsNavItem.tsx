import { getNbNewNotifications } from "containers/Backend/UserNotifications/lib";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PathNames } from "routes";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification
} from "services/UserStructure/userStructure.selectors";
import BackendNavItem from "../BackendNavItem";

const MyNotificationsNavItem = () => {
  const { t } = useTranslation();
  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(userStructureHasResponsibleSeenNotification);

  const nbNewNotifications = getNbNewNotifications(dispositifsAssocies, hasResponsibleSeenNotification);
  return (
    <BackendNavItem
      access="hasStructure"
      iconName={nbNewNotifications > 0 ? "bell" : "bell-outline"}
      route={"/backend/user-dash-notifications" as PathNames}
      title={`${t("Toolbar.Mes notifications")} (${nbNewNotifications})`}
    />
  );
};

export default MyNotificationsNavItem;
