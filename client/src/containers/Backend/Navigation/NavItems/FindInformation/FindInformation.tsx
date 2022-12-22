import { t } from "i18next";
import { useRouter } from "next/router";
import { getPath, PathNames } from "routes";
import BackendNavItem from "../BackendNavItem";

const FindInformation = () => {
  const router = useRouter();
  return (
    <BackendNavItem
      access="all"
      iconName="search-outline"
      route={getPath("/recherche", router.locale) as PathNames}
      titlekey="Toolbar.Trouver de l'information"
    />
  );
};

export default FindInformation;
