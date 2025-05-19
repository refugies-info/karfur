import { UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useCallback, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { ModalLocation, ModalPrice } from "~/components/Pages/dispositif/Edition/Modals";
import FRLink from "~/components/UI/FRLink";
import { formatDepartment } from "~/lib/departments";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import { getCommitment, getFrequency, getLocationLink, getPrice, getTimeSlots } from "../functions";

interface Props {
  onClick?: () => void;
  formData?: UpdateDispositifRequest;
}

const CardInfo = ({ onClick, formData }: Props) => {
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
  const { activeModal, setActiveModal } = useContext(PageContext);
  const toggleModal = useCallback(() => setActiveModal?.(null), [setActiveModal]);

  console.log(dispositif);

  // Toggle visibility, if edit mode true, else check if there is any data
  const showCard = isEditMode ? true : price || location || timeSlots || commitment || frequency;

  return (
    <>
      {showCard ? (
        <MetaDataCard title="Informations pratiques">
          {isEditMode || price ? (
            <MetaDataItem
              icon="fr-icon-money-euro-circle-line"
              title="Prix"
              onClick={isEditMode ? () => setActiveModal?.("Price") : undefined}
            >
              {price ? getPrice(price, t) : "Non pertinent pour mon action"}
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
          {isEditMode || timeSlots ? (
            <MetaDataItem title="Timeslots">
              {timeSlots ? getTimeSlots(timeSlots, t) : "Non pertinent pour mon action"}
            </MetaDataItem>
          ) : null}
          {isEditMode || commitment ? (
            <MetaDataItem title="commitment">
              {commitment ? getCommitment(commitment, t) : "Non pertinent pour mon action"}
            </MetaDataItem>
          ) : null}
          {isEditMode || frequency ? (
            <MetaDataItem title="freq">
              {frequency ? getFrequency(frequency, t) : "Non pertinent pour mon action"}
            </MetaDataItem>
          ) : null}
        </MetaDataCard>
      ) : null}

      {isEditMode && (
        <>
          <ModalPrice show={activeModal === "Price"} toggle={toggleModal} />
          <ModalLocation show={activeModal === "Location"} toggle={toggleModal} />
        </>
      )}
    </>
  );
};

export default CardInfo;

// interface Props {
//   dataCommitment: Metadatas["commitment"] | undefined;
//   dataTimeSlots: Metadatas["timeSlots"] | undefined;
//   dataFrequency: Metadatas["frequency"] | undefined;
//   onClick?: () => void;
// }

// const CardAvailability = ({ dataCommitment, dataTimeSlots, dataFrequency, onClick }: Props) => {
//   const { t } = useTranslation();

//   return (
//     <BaseCard
//       title={t("Infocards.availability")}
//       items={[
//         {
//           label: t("Infocards.commitment"),
//           content: getCommitment(dataCommitment, t),
//           icon: <DurationIcon />,
//         },
//         {
//           label: t("Infocards.frequency"),
//           content: getFrequency(dataFrequency, t),
//           icon: <DurationIcon />,
//         },
//         {
//           label: t("Infocards.weekDays"),
//           content: getTimeSlots(dataTimeSlots, t),
//           icon: <DurationIcon />,
//         },
//       ]}
//       onClick={onClick}
//     />
//   );
// };

// export default CardAvailability;
