import { useRouter } from "next/compat/router";
import { useEffect, useState } from "react";

const checkIsEditionMode = (pathname: string | undefined) =>
  pathname
    ? [
        "/dispositif",
        "/demarche",
        "/dispositif/[id]/edit",
        "/demarche/[id]/edit",
        "/dispositif/[id]/translate",
        "/demarche/[id]/translate",
      ].includes(pathname)
    : false;

const useEditionMode = () => {
  const router = useRouter();
  const [isEditionMode, setIsEditionMode] = useState(checkIsEditionMode(router?.pathname));

  useEffect(() => {
    setIsEditionMode(checkIsEditionMode(router?.pathname));
  }, [router?.pathname]);

  return isEditionMode;
};

export default useEditionMode;
