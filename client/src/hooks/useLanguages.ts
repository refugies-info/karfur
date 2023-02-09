import { keyBy } from "lodash";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { userSelectedLanguageSelector } from "services/User/user.selectors";

const useLanguages = () => {
  const langues = useSelector(allLanguesSelector);
  const userTradLanguages = useSelector(userSelectedLanguageSelector);
  const languageById = keyBy(langues, (langue) => langue._id);
  const getLanguage = (id: string) => languageById[id];

  return { langues, getLanguage, userTradLanguages };
};

export default useLanguages;
