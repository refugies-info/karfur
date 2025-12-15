import type { GetDispositifResponse } from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import StatusAndEditButtons from "~/components/Pages/dispositif/Breadcrumb/StatusAndEditButtons";
import { themeSelector } from "~/services/Themes/themes.selectors";
import BreadcrumbDetails from "./BreadcrumbDetails";

interface Props {
  dispositif: GetDispositifResponse | null;
}

const Breadcrumb = ({ dispositif }: Props) => {
  const theme = useSelector(themeSelector(dispositif?.theme));

  if (!dispositif) return null;
  return (
    <div
      className="w-full bg-white/80 py-3 text-xs print:hidden"
      style={{ backgroundColor: theme?.colors.color30 || "" }}
    >
      <div className="fr-container flex justify-between">
        <div className="flex items-center">
          <BreadcrumbDetails dispositif={dispositif} />
        </div>
        <div className="flex items-center justify-end">
          <StatusAndEditButtons dispositif={dispositif} />
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
