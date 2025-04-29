import { useEffect, useState } from "react";

const useAnonymousUserId = () => {
  const [anonymousUserId, setAnonymousUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (anonymousUserId) return;
    const storedId = localStorage.getItem("anonymousUserId");
    if (storedId) {
      setAnonymousUserId(storedId);
    } else {
      const newId = `${Date.now()}`;
      localStorage.setItem("anonymousUserId", newId);
      setAnonymousUserId(newId);
    }
  }, [anonymousUserId]);

  return anonymousUserId;
};

export { useAnonymousUserId };
