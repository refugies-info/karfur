"use client";

import { useEffect, useState } from "react";

export const checkIsRTL = (locale: string | undefined) => ["ar", "ps", "fa"].includes(locale || "fr");

const useRTL = () => {
  const locale = "fr"; // useLocale();
  const [isRTL, setIsRTL] = useState<boolean>(checkIsRTL(locale));

  useEffect(() => {
    setIsRTL(checkIsRTL(locale));
  }, [locale]);

  return isRTL;
};

export default useRTL;
