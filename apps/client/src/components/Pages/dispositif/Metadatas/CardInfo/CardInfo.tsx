import { UpdateDispositifRequest } from "@refugies-info/api-types";
import { cn, MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { HTMLAttributes, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import FRLink from "~/components/UI/FRLink";
import { formatDepartment } from "~/lib/departments";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import { getCommitment, getFrequency, getLocationLink, getPrice, getTimeSlots } from "../functions";

type CardInfoProps = HTMLAttributes<HTMLDivElement> & {
  onClick?: () => void;
  formData?: UpdateDispositifRequest;
};

const CardInfo = ({ onClick, formData, className, ...props }: CardInfoProps) => {
  const { t } = useTranslation();

  const { mode } = useContext(PageContext);
  const isEditMode = useMemo(() => mode === "edit", [mode]);

  const dispositifSelector = useSelector(selectedDispositifSelector);
  const dispositif = formData ? formData : dispositifSelector;
  const price = dispositif?.metadatas?.price;
  const location = dispositif?.metadatas?.location;
  const timeSlots = dispositif?.metadatas?.timeSlots;
  const commitment = dispositif?.metadatas?.commitment;
  const frequency = dispositif?.metadatas?.frequency;
  const { setActiveModal, setModalPage } = useContext(PageContext);

  // Toggle visibility, if edit mode true, else check if there is any data
  const showCard = isEditMode ? true : price || location || timeSlots || commitment || frequency;

  return (
    <>
      {showCard ? (
        <MetaDataCard
          mode={isEditMode ? "edit" : "view"}
          state={price ? "valid" : "invalid"}
          title="Informations pratiques"
          className={cn(className)}
          {...props}
        >
          {isEditMode || price ? (
            <MetaDataItem
              icon="fr-icon-money-euro-circle-line"
              title="Prix"
              onClick={isEditMode ? () => setActiveModal?.("Price") : undefined}
            >
              {price ? getPrice(price, t) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || commitment ? (
            <MetaDataItem
              icon="ri-hourglass-line"
              title={t("Infocards.commitment")}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(1);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {commitment ? getCommitment(commitment, t) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || frequency ? (
            <MetaDataItem
              icon="ri-calendar-schedule-line"
              title={t("Infocards.frequency")}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(2);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {frequency ? getFrequency(frequency, t) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || timeSlots ? (
            <MetaDataItem
              icon="ri-calendar-event-line"
              title={t("Infocards.weekDays")}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(3);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {timeSlots ? getTimeSlots(timeSlots, t) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || location
            ? (() => {
                let title = t("Infocards.departements", "Departements :");
                if (location === "france") title = t("Infocards.france", "France");
                else if (location === "online") title = t("Recherche.online", "En ligne");
                return (
                  <MetaDataItem
                    icon={location === "online" ? "ri-at-line" : "fr-icon-france-line"}
                    title={title}
                    onClick={isEditMode ? () => setActiveModal?.("Location") : undefined}
                  >
                    {Array.isArray(location)
                      ? location.map((loc: string) => (
                          <FRLink
                            key={loc}
                            href={isEditMode ? "#" : getLocationLink(loc)}
                            onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}
                          >
                            {formatDepartment(loc)}
                          </FRLink>
                        ))
                      : null}
                  </MetaDataItem>
                );
              })()
            : null}
        </MetaDataCard>
      ) : null}
    </>
  );
};

export default CardInfo;
