import { userSelector } from "@/services/User/user.selectors";
import { useSelector } from "react-redux";

const useUser = () => {
  const user = useSelector(userSelector);
  return { user };
};

export default useUser;
