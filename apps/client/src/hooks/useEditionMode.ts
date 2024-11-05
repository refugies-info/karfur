import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const checkIsEditionMode = (pathname: string) =>
  [
    "/dispositif",
    "/demarche",
    "/dispositif/[id]/edit",
    "/demarche/[id]/edit",
    "/dispositif/[id]/translate",
    "/demarche/[id]/translate",
  ].includes(pathname);

const useEditionMode = () => {
  const router = useRouter();
  const [isEditionMode, setIsEditionMode] = useState(checkIsEditionMode(router.pathname));

  useEffect(() => {
    setIsEditionMode(checkIsEditionMode(router.pathname));
  }, [router.pathname]);

  return isEditionMode;
};

export default useEditionMode;
