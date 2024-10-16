import { fr } from "@codegouvfr/react-dsfr";
import { SectionTitle } from "~/components/Pages/dispositif";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Tooltip from "~/components/UI/Tooltip";
import { useUniqueId } from "~/hooks";
import { cls } from "~/lib/classname";
import styles from "./SectionTitleAbstract.module.scss";

const SectionTitleAbstract = () => {
  const tooltipId = useUniqueId("help_abstract_");

  return (
    <span className={cls(styles.abstract, "mt-8")}>
      <SectionTitle titleKey="abstract" />
      <EVAIcon
        id={tooltipId}
        name="question-mark-circle-outline"
        size={32}
        fill={fr.colors.decisions.text.mention.grey.default}
        className="ms-6 mb-4"
      />
      {tooltipId && (
        <Tooltip target={tooltipId} placement="right">
          Ce résumé n’est pas visible sur la fiche, il est utilisé dans la recherche par mots-clés.
        </Tooltip>
      )}
    </span>
  );
};

export default SectionTitleAbstract;
