import { MouseEvent, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useIsomorphicLayoutEffect } from "react-use";
import { PathNames } from "routes";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useRouterLocale from "hooks/useRouterLocale";
import { userSelector } from "services/User/user.selectors";
import history from "utils/backendHistory";
import styles from "./BackendNavItem.module.scss";
import { cls } from "lib/classname";
import isInBrowser from "lib/isInBrowser";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useAuth } from "hooks";

export interface Props {
  access: string;
  iconName: string;
  iconColor?: string;
  onClick?: () => void;
  route?: PathNames;
  title?: string;
}

const useBackendNavItem = ({
  access,
  iconName,
  iconColor,
  route,
  title,
  onClick,
}: Props): MainNavigationProps.Item | null => {
  const routerLocale = useRouterLocale();
  const user = useSelector(userSelector);
  const { isAuth } = useAuth();

  const isCurrent = useCallback(
    (pathname: string) => isInBrowser() && pathname.includes(routerLocale + route),
    [routerLocale, route],
  );
  const [isActive, setIsActive] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const unlisten = history?.listen((h) => setIsActive(isCurrent(h.pathname)));
    return unlisten;
  }, [isCurrent]);

  const isAdmin = user && user.admin;
  const hasStructure = user && user.hasStructure;
  if (!isAuth) return null;
  if (access === "admin" && !isAdmin) return null;
  if (access === "hasStructure" && !hasStructure) return null;

  const _onClick = onClick
    ? (e: MouseEvent) => {
        e.preventDefault();
        onClick();
      }
    : (e: MouseEvent) => {
        e.preventDefault();
        history?.push(routerLocale + route);
      };

  const color = iconColor || (isActive ? styles.lightTextActionHighBlueFrance : "black");
  return {
    isActive: isActive,
    linkProps: {
      href: "#",
      onClick: _onClick,
    },
    text: (
      <>
        <EVAIcon fill={color} name={iconName} className={cls(!!title && "me-2")} />
        <span>{title}</span>
        {/* TODO: on small screens, hide title */}
      </>
    ),
  };
};

export default useBackendNavItem;
