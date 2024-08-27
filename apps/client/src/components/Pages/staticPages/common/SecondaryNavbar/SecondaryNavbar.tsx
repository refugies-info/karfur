import Link from "next/link";
import { Container } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
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

  return (
    <div className={cls(styles.container, props.isSticky && styles.shadow)}>
      <Container className={styles.inner}>
        <div>
          {props.leftLinks.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              onClick={smoothScroll}
              className={cls(styles.btn, styles[link.color], isActive(link.id) && styles.active)}
            >
              {link.text}
            </Link>
          ))}
        </div>
        <Link
          href={`#${props.rightLink.id}`}
          onClick={smoothScroll}
          className={cls(styles.btn, styles[props.rightLink.color], isActive(props.rightLink.id) && styles.active)}
        >
          <EVAIcon name="plus-circle-outline" size={20} />
          {props.rightLink.text}
        </Link>
      </Container>
    </div>
  );
};

export default SecondaryNavbar;
