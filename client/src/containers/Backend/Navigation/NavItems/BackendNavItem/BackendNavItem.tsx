import { NavItem } from "@dataesr/react-dsfr";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useRouterLocale from "hooks/useRouterLocale";
import Link from "next/link";
import { MouseEvent } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { getPath, PathNames } from "routes";
import { userSelector } from "services/User/user.selectors";
import history from "utils/backendHistory";

export interface BackendNavItem {
  access: string;
  iconName: string;
  onClick?: () => any;
  route: PathNames;
  title?: string;
  titlekey?: string;
}

const BackendNavItem = ({ access, iconName, route, title, titlekey, onClick }: BackendNavItem) => {
  const routerLocale = useRouterLocale();
  const user = useSelector(userSelector);
  const { t } = useTranslation();

  const isAdmin = user && user.admin;
  const hasStructure = user && user.hasStructure;

  if (access === "admin" && !isAdmin) return null;
  if (access === "hasStructure" && !hasStructure) return null;

  const enable = window.location.pathname.endsWith(getPath(route, routerLocale));

  const _onClick = onClick
    ? (e: MouseEvent) => {
        e.preventDefault();
        onClick();
      }
    : () => history?.push(routerLocale + route);
  // @ts-ignore
  const _title = (titlekey ? t(titlekey) : title) as string;
  return (
    <NavItem
      current={enable}
      onClick={_onClick}
      asLink={
        <Link href={route}>
          <EVAIcon fill={enable ? styles.lightTextActionHighBlueFrance : "black"} name={iconName} className="me-2" />
          <span className="refugies-backend-header-menu-title">{_title}</span>
        </Link>
      }
      title={_title}
    />
  );
};

export default BackendNavItem;
