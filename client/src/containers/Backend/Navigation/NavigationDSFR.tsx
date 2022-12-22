import { useRouter } from "next/router";
import { HeaderNav } from "@dataesr/react-dsfr";

import {
  Admin,
  FindInformation,
  Logout,
  MyContributions,
  MyFavorites,
  MyNotificationsNavItem,
  MyProfile,
  MyStructure,
  MyTranslations
} from "./NavItems";

import styles from "./NavigationDSFR.module.scss";
import { useAuth } from "hooks";

const Navigation = () => {
  const router = useRouter();
  const { isAuth } = useAuth();

  if (!isAuth || !router.pathname.includes("/backend")) return null;

  return (
    <HeaderNav className={styles["refugies-backend-header-menu"]}>
      <FindInformation />
      <MyNotificationsNavItem />
      <MyFavorites />
      <MyContributions />
      <MyTranslations />
      <MyStructure />
      <MyProfile />
      <Admin />
      <Logout />
    </HeaderNav>
  );
};

Navigation.defaultProps = {
  __TYPE: "HeaderNav"
};

export default Navigation;
