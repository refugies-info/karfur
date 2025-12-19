import type { UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { type HTMLAttributes, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { getConditionImage } from "~/components/Pages/dispositif/Metadatas/functions";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";

type Props = HTMLAttributes<HTMLDivElement> & {
  onClick?: () => void;
  formData?: UpdateDispositifRequest;
};

const CardConditions = ({ formData, ...props }: Props) => {
  const { t } = useTranslation();
  const { mode } = useContext(PageContext);
  const isEditMode = useMemo(() => mode === "edit", [mode]);
  const { formSubmitted } = useContext(PageContext);

  const dispositifSelector = useSelector(selectedDispositifSelector);
  const dispositif = formData ? formData : dispositifSelector;

  const conditions = dispositif?.metadatas?.conditions;

  const { setActiveModal } = useContext(PageContext);

  return conditions && conditions.length > 0 ? (
    <>
      <MetaDataCard
        title={t("Infocards.conditions")}
        onClick={isEditMode ? () => setActiveModal?.("Conditions") : undefined}
      >
        {conditions.map((condition) => {
          return (
            <MetaDataItem
              key={condition}
              logoImage={{
                url: getConditionImage(condition),
                alt: condition,
              }}
              title={t(`Infocards.${condition}`)}
            >
              {t(`Infocards.${condition}_description` as any)}
            </MetaDataItem>
          );
        })}
      </MetaDataCard>
    </>
  ) : isEditMode ? (
    <MetaDataCard
      state={formSubmitted && conditions === undefined ? "invalid" : undefined}
      title={t("Infocards.conditions")}
      onClick={() => setActiveModal?.("Conditions")}
    >
      {conditions === null ? "Non pertinent pour mon action" : undefined}
    </MetaDataCard>
  ) : null;
};

export default CardConditions;
