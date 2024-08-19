import { useSelector } from "react-redux";
import { userSelector } from "services/User/user.selectors";

const useUser = () => {
  const user = useSelector(userSelector);
  return { user };
};

export default useUser;
