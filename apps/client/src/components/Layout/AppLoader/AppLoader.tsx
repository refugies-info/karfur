import Image from "next/image";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import loader_logo from "~/assets/loader_logo.png";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import styles from "./AppLoader.module.scss";

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const loading = useSelector(isLoadingSelector(LoadingStatusKey.NAVIGATING));

  return loading ? (
    <div className={styles.loader}>
      <div>
        <Image height={100} width={100} alt="Loader logo" src={loader_logo} />
        <p>Chargement ...</p>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default AppLoader;
