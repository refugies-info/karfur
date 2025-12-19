import type { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { RoleName } from "@refugies-info/api-types";
import { isInBrowser } from "@refugies-info/ui";
import { type MouseEvent, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useIsomorphicLayoutEffect } from "react-use";
import type { PathNames } from "routes";
import { useAuth } from "~/hooks";
import useRouterLocale from "~/hooks/useRouterLocale";
import { cn } from "~/lib/classname";
import { userSelector } from "~/services/User/user.selectors";
import history from "~/utils/backendHistory";
import styles from "./BackendNavItem.module.scss";

type CustomIconClassName = `custom-icon-${string}`;

export interface Props {
  access: RoleName.STRUCTURE | RoleName.ADMIN | "all";
  iconName: FrIconClassName | RiIconClassName | CustomIconClassName;
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

  const color =
    iconColor || (isActive ? fr.colors.decisions.text.actionHigh.blueFrance.default : "black");
  return {
    isActive: isActive,
    linkProps: {
      href: "#",
      onClick: _onClick,
    },
    text: (
      <>
        <i className={cn(iconName, "h-6 w-6")} />
        <span className={styles.item} style={textColor ? { color: textColor } : {}}>
          {title}
        </span>
      </>
    ),
  };
};

export default useBackendNavItem;
