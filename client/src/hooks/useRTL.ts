import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const checkIsRTL = (locale: string | undefined) => ["ar", "ps", "fa"].includes(locale || "fr");

const useRTL = () => {
  const router = useRouter();
  const [isRTL, setIsRTL] = useState<boolean>(checkIsRTL(router.locale));

  useEffect(() => {
    setIsRTL(checkIsRTL(router.locale));
  }, [router.locale]);

  return isRTL;
}

export default useRTL;
