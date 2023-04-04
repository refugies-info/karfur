import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const checkIsEditionMode = (pathname: string) => ["/dispositif", "/demarche", "/dispositif/[id]/edit", "/demarche/[id]/edit"].includes(pathname);

const useEditionMode = () => {
  const router = useRouter();
  const [isEditionMode, setIsEditionMode] = useState(checkIsEditionMode(router.pathname));

  useEffect(() => {
    setIsEditionMode(checkIsEditionMode(router.pathname))
  }, [router.pathname]);

  return isEditionMode;
}

export default useEditionMode;
