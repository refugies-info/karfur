import { FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useCallback } from "react";
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
  const isActive = (view: string) => props.activeView === view;

  const scrollTo = useCallback((id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className="fr-container flex flex-nowrap items-start justify-between gap-10 py-4 md:py-10">
        <div className={cls(styles.nav, "shrink-1")}>
          <SegmentedControl
            hideLegend
            //@ts-ignore
            segments={props.leftLinks.map((link) => ({
              label: link.text,
              nativeInputProps: {
                checked: isActive(link.id),
                onClick: () => scrollTo(link.id),
                readOnly: true,
              },
            }))}
          />
        </div>
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
  );
};

export default SecondaryNavbar;
