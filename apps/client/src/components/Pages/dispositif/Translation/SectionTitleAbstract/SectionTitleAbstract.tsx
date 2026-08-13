import { fr } from "@codegouvfr/react-dsfr";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { SectionTitle } from "~/components/Pages/dispositif";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { useUniqueId } from "~/hooks";
import { cls } from "~/lib/classname";
import styles from "./SectionTitleAbstract.module.scss";

const SectionTitleAbstract = () => {
  const tooltipId = useUniqueId("help_abstract_");

  return (
    <span className={cls(styles.abstract, "mt-8")}>
      <SectionTitle titleKey="abstract" />
      {tooltipId && (
        <Tooltip
          kind="hover"
          title="Ce résumé n’est pas visible sur la fiche, il est utilisé dans la recherche par mots-clés."
        >
          <EVAIcon
            name="question-mark-circle-outline"
            size={32}
            fill={fr.colors.decisions.text.mention.grey.default}
            className="ms-6 mb-4"
            ariaLabel="Aide"
          />
        </Tooltip>
      )}
    </span>
  );
};

export default SectionTitleAbstract;
