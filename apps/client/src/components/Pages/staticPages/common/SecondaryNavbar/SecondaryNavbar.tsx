import type { FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import { useCallback, useRef } from "react";
import useIsSticky from "~/hooks/useIsSticky";
import { cls } from "~/lib/classname";
import { smoothScroll } from "~/lib/smoothScroll";
import styles from "./SecondaryNavbar.module.scss";

type LinkNavbar = {
  id: string;
  href?: string;
  iconId?: FrIconClassName;
  text: string;
};

interface Props {
  leftLinks: LinkNavbar[];
  rightLink?: LinkNavbar;
  activeView: string | null;
}

const SecondaryNavbar = (props: Props) => {
  const { t } = useTranslation();
  const isActive = (view: string) => props.activeView === view;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(sentinelRef);

  // Move focus to the target anchor, then scroll smoothly and update the URL hash
  const goTo = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="-mb-px h-px" />
      <div className={cls("sticky top-0 z-20 bg-white", isSticky && "shadow-sm")}>
        <div className="container flex flex-nowrap items-start justify-between gap-10 py-4 md:py-10">
          <nav aria-label={t("Dispositif.summary", "Sommaire")} className={styles.nav}>
            <ul className="fr-raw-list">
              {props.leftLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="fr-raw-link"
                    aria-current={isActive(link.id) ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(link.id);
                    }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {props.rightLink && (
            <div className="hidden shrink-0 md:block">
              <Button
                iconId={props.rightLink.iconId || "fr-icon-arrow-right-line"}
                iconPosition="right"
                linkProps={
                  props.rightLink.href
                    ? {
                        href: props.rightLink.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {
                        onClick: smoothScroll,
                        href: `#${props.rightLink.id}`,
                      }
                }
              >
                {props.rightLink.text}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SecondaryNavbar;
