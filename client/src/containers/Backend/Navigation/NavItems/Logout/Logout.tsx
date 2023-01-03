import { NavItem } from "@dataesr/react-dsfr";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Link from "next/link";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setUserActionCreator } from "services/User/user.actions";
import { setUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import API from "utils/API";

import styles from "./Logout.module.scss";

const Logout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const disconnect = (e: MouseEvent) => {
    e.preventDefault();
    API.logout();
    dispatch(setUserActionCreator(null));
    dispatch(setUserStructureActionCreator(null));
    window.location.href = "/";
  };
  return (
    <NavItem
      onClick={disconnect}
      asLink={
        <Link href="#">
          <EVAIcon fill="#e55039" className="me-2" name="log-out-outline" />
          <span className={styles.logout_label + " refugies-backend-header-menu-title"}></span>
        </Link>
      }
      title=""
    />
  );
};

export default Logout;
