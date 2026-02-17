import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import CardInfo from "~/components/Pages/dispositif/Metadatas/CardInfo";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import CardConditions from "./CardConditions";
import CardPublic from "./CardPublic";
import CardSessions from "./CardSessions";

interface Props {
  className?: string;
}

/**
 * Shows the metadatas of a dispositif, with Cards, in VIEW mode
 */
const Metadatas = ({ className }: Props) => {
  const { t } = useTranslation();

  const dispositifSelector = useSelector(selectedDispositifSelector);

  if (!dispositifSelector) return <></>;
  return (
    <div id="anchor-metadatas" className={cn(className)}>
      <h2 className="text-title-lg font-bold lg:hidden">{t("Dispositif.importantInformations")}</h2>

      {dispositifSelector.origin === "RCO" && <CardSessions />}
      <CardPublic />
      <CardInfo />
      <CardConditions />
    </div>
  );
};

export default Metadatas;
