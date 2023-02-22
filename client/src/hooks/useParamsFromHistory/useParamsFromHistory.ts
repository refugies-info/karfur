import { useHistory } from "react-router-dom";

const useParamsFromHistory = () => {
  const url = new URL("http://dummy/" + useHistory().location.pathname + useHistory().location.search);
  return url.searchParams;
};

export default useParamsFromHistory;
