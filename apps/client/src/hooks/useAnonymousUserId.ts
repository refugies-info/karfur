import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "~/services/User/user.selectors";

const useAnonymousUserId = () => {
  const [anonymousUserId, setAnonymousUserId] = useState<string | undefined>(undefined);
  const userId = useSelector(userSelector)?.userId?.toString();

  useEffect(() => {
    if (userId) {
      setAnonymousUserId(undefined);
      return;
    }
    if (anonymousUserId) return;
    const storedId = localStorage.getItem("anonymousUserId");
    if (storedId) {
      setAnonymousUserId(storedId);
    } else {
      const newId = `${Date.now()}`;
      localStorage.setItem("anonymousUserId", newId);
      setAnonymousUserId(newId);
    }
  }, [anonymousUserId, userId]);

  return anonymousUserId;
};

export { useAnonymousUserId };
