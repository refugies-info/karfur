import Button from "@codegouvfr/react-dsfr/Button";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useCallback } from "react";
import { smoothScroll } from "~/lib/smoothScroll";
import styles from "./SecondaryNavbar.module.scss";

type LinkNavbar = {
  id: string;
  color: "green" | "purple" | "orange" | "red" | "blue";
  text: string;
};

interface Props {
  leftLinks: LinkNavbar[];
  rightLink: LinkNavbar;
  activeView: string | null;
  isSticky: boolean;
}

const SecondaryNavbar = (props: Props) => {
  const isActive = (view: string) => props.activeView === view;

  const scrollTo = useCallback((id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="sticky top-0 bg-white z-20">
      <div className="fr-container flex gap-10 justify-between items-start flex-nowrap py-4 md:py-10">
        <div className={styles.nav}>
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
        <div className="hidden md:block">
          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            linkProps={{
              onClick: smoothScroll,
              href: `#${props.rightLink.id}`,
            }}
          >
            {props.rightLink.text}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
