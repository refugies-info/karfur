import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "services/User/user.selectors";
import API from "utils/API";

const useAuth = () => {
  const user = useSelector(userSelector);
  const [isAuth, setIsAuth] = useState(false);

  /*
   * Is important to use useEffect to avoid Hydration errors
   * https://javascript.plainenglish.io/how-to-solve-hydration-error-in-next-js-a50ec54bfc02
   */
  useEffect(() => {
    setIsAuth(API.isAuth());
  }, [user]);
  return { isAuth };
};

export default useAuth;
