import { MouseEvent, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useIsomorphicLayoutEffect } from "react-use";
import { RoleName } from "@refugies-info/api-types";
import { PathNames } from "routes";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useRouterLocale from "hooks/useRouterLocale";
import { userSelector } from "services/User/user.selectors";
import history from "utils/backendHistory";
import styles from "./BackendNavItem.module.scss";
import isInBrowser from "lib/isInBrowser";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useAuth } from "hooks";

export interface Props {
  access: RoleName.STRUCTURE | RoleName.ADMIN | "all";
  iconName: string;
  iconColor?: string;
  textColor?: string;
  onClick?: () => void;
  route?: PathNames;
  title?: string;
}

const useBackendNavItem = ({
  access,
  iconName,
  iconColor,
  textColor,
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
  if (access === RoleName.ADMIN && !isAdmin) return null;
  if (access === RoleName.STRUCTURE && !hasStructure) return null;

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
        <EVAIcon fill={color} name={iconName} />
        <span className={styles.item} style={textColor ? { color: textColor } : {}}>
          {title}
        </span>
      </>
    ),
  };
};

export default useBackendNavItem;
