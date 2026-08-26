import type { UpdateDispositifRequest } from "@refugies-info/api-types";
import { cn, MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { type HTMLAttributes, useContext, useMemo } from "react";
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
  const { setActiveModal, setModalPage, formSubmitted } = useContext(PageContext);

  // Toggle visibility, if edit mode true, else check if there is any data
  const showCard = isEditMode ? true : price || location || timeSlots || commitment || frequency;

  return (
    <>
      {showCard ? (
        <MetaDataCard
          mode={isEditMode ? "edit" : "view"}
          state={price ? "valid" : "invalid"}
          title={t("Dispositif.practicalInformations")}
          className={cn(className)}
          {...props}
        >
          {isEditMode || price ? (
            <MetaDataItem
              icon="fr-icon-money-euro-circle-line"
              title={t("Dispositif.price")}
              state={formSubmitted && price === undefined ? "invalid" : undefined}
              onClick={isEditMode ? () => setActiveModal?.("Price") : undefined}
            >
              {price === null
                ? "Non pertinent pour mon action"
                : price
                  ? getPrice(price, t)
                  : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || commitment ? (
            <MetaDataItem
              icon="ri-hourglass-line"
              title={t("Infocards.commitment")}
              state={formSubmitted && commitment === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(1);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {commitment === null
                ? "Non pertinent pour mon action"
                : commitment
                  ? getCommitment(commitment, t)
                  : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || frequency ? (
            <MetaDataItem
              icon="ri-calendar-schedule-line"
              title={t("Infocards.frequency")}
              state={formSubmitted && frequency === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(2);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {frequency === null
                ? "Non pertinent pour mon action"
                : frequency
                  ? getFrequency(frequency, t)
                  : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || timeSlots ? (
            <MetaDataItem
              icon="ri-calendar-event-line"
              title={t("Infocards.weekDays")}
              state={formSubmitted && timeSlots === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(3);
                      setActiveModal?.("Availability");
                    }
                  : undefined
              }
            >
              {timeSlots === null
                ? "Non pertinent pour mon action"
                : timeSlots
                  ? getTimeSlots(timeSlots, t)
                  : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || location
            ? (() => {
                let title = t("Infocards.departements", "Departements :");
                if (location === "france") title = t("Infocards.france", "France");
                else if (location === "online") title = t("Recherche.online", "En ligne");
                // La liste des départements est une énumération : elle se structure en ul/li
                // (RGAA 9.3). contentAs="ul" est nécessaire parce qu'un ul ne peut pas vivre
                // dans le p que MetaDataItem pose par défaut. Le li est en display:inline
                // pour ne pas changer le flux, que le conteneur soit en flex ou en inline.
                const hasDepartments = Array.isArray(location) && location.length > 0;
                return (
                  <MetaDataItem
                    icon={location === "online" ? "ri-at-line" : "fr-icon-france-line"}
                    title={title}
                    state={formSubmitted && location === undefined ? "invalid" : undefined}
                    onClick={isEditMode ? () => setActiveModal?.("Location") : undefined}
                    contentAs={hasDepartments ? "ul" : "p"}
                  >
                    {hasDepartments
                      ? (location as string[]).map((loc: string) => (
                          <li key={loc} className="inline sm:flex">
                            <FRLink
                              href={isEditMode ? "#" : getLocationLink(loc)}
                              onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}
                            >
                              {formatDepartment(loc)}
                            </FRLink>
                          </li>
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
