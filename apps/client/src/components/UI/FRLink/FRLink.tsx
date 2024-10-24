import { fr } from "@codegouvfr/react-dsfr";
import Link, { LinkProps } from "next/link";
import React, { useMemo } from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import styles from "./FRLink.module.scss";

interface Props {
  href?: LinkProps["href"];
  children: string | React.ReactNode;
  className?: string;
  icon?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: (e: any) => void;
}

const FRLink = (props: Props) => {
  const content = useMemo(() => {
    return (
      <>
        {props.icon && (
          <EVAIcon
            name={props.icon}
            size={20}
            fill={fr.colors.decisions.text.actionHigh.blueFrance.default}
            className="me-2"
          />
        )}
        {props.children}
      </>
    );
  }, [props.icon, props.children]);

  return !props.href ? (
    <button onClick={props.onClick} className={cls("fr-link", styles.link, props.className)} type="button">
      {content}
    </button>
  ) : (
    <Link
      href={props.href}
      target={props.target}
      onClick={props.onClick}
      className={cls("fr-link", styles.link, props.className)}
    >
      {content}
    </Link>
  );
};

export default FRLink;
