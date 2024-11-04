import Image from "next/image";
import loader_logo from "~/assets/loader_logo.png";
import styles from "./AppLoader.module.scss";

const AppLoader = () => {
  return (
    <div className={styles.loader}>
      <div>
        <Image height={100} width={100} alt="Loader logo" src={loader_logo} />
        <p>Chargement ...</p>
      </div>
    </div>
  );
};

export default AppLoader;
