"use client";

import { useEffect, useState } from "react";
import { usePathname } from "~/i18n/routing";

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
  const pathname = usePathname();
  const [isEditionMode, setIsEditionMode] = useState(checkIsEditionMode(pathname));

  useEffect(() => {
    setIsEditionMode(checkIsEditionMode(pathname));
  }, [pathname]);

  return isEditionMode;
};

export default useEditionMode;
