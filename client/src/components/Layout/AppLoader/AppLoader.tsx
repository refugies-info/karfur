import Image from "next/image";
import loader_logo from "assets/loader_logo.png";
import { ReactNode } from "react";
import { useLoadingContext } from "pages";

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const [loading] = useLoadingContext();

  return loading ? (
    <div className="app-loader">
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
