import Image from "next/image";
import styles from "./Loader.module.scss";

interface Props {
  text: string;
  subtitle?: string;
}

const Loader = (props: Props) => {
  return (
    <div className={styles.loader}>
      <Image src="/images/logo-navbar-ri.svg" width="45" height="45" alt="" />
      <p className="mt-6 mb-2">{props.text}</p>
      {props.subtitle && <p>{props.subtitle}</p>}
    </div>
  );
};

export default Loader;
