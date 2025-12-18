import type { UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { type HTMLAttributes, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import FRLink from "~/components/UI/FRLink";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import {
  getAge,
  getAgeLink,
  getFrenchLevel,
  getFrenchLevelLink,
  getPublic,
  getPublicStatus,
} from "../functions";

type Props = HTMLAttributes<HTMLDivElement> & {
  onClick?: () => void;
  formData?: UpdateDispositifRequest;
};

const CardPublic = ({ formData, ...props }: Props) => {
  const { t } = useTranslation();

  const { mode } = useContext(PageContext);
  const isEditMode = useMemo(() => mode === "edit", [mode]);

  const dispositifSelector = useSelector(selectedDispositifSelector);
  const dispositif = formData ? formData : dispositifSelector;

  const publicSpecific = dispositif?.metadatas?.public;
  const publicStatus = dispositif?.metadatas?.publicStatus;
  const publicAge = dispositif?.metadatas?.age;
  const publicFrenchLevel = dispositif?.metadatas?.frenchLevel;
  const { setActiveModal, setModalPage, formSubmitted } = useContext(PageContext);

  // Toggle visibility, if edit mode true, else check if there is any data
  const showCard = isEditMode
    ? true
    : publicSpecific || publicStatus || publicAge || publicFrenchLevel;

  return (
    <>
      {showCard ? (
        <MetaDataCard
          mode={isEditMode ? "edit" : "view"}
          state={publicSpecific ? "valid" : "invalid"}
          title={t("Infocards.publicTitle")}
          {...props}
        >
          {isEditMode || publicStatus ? (
            <MetaDataItem
              icon="ri-id-card-line"
              title={t("Infocards.publicStatus")}
              state={formSubmitted && publicStatus === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(1);
                      setActiveModal?.("Public");
                    }
                  : undefined
              }
            >
              {publicStatus ? getPublicStatus(publicStatus, t) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || publicSpecific ? (
            <MetaDataItem
              icon="fr-icon-group-line"
              title={t("Infocards.public")}
              state={formSubmitted && publicSpecific === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(2);
                      setActiveModal?.("Public");
                    }
                  : undefined
              }
            >
              {publicSpecific
                ? getPublic(publicSpecific, t)
                : publicSpecific === null && "Non pertinent pour mon action"}
            </MetaDataItem>
          ) : null}

          {isEditMode || publicFrenchLevel ? (
            <MetaDataItem
              icon="fr-icon-discuss-line"
              title={t("Infocards.frenchLevel")}
              state={formSubmitted && publicFrenchLevel === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(3);
                      setActiveModal?.("Public");
                    }
                  : undefined
              }
            >
              {publicFrenchLevel === null ? (
                "Non pertinent pour mon action"
              ) : publicFrenchLevel ? (
                !publicFrenchLevel || publicFrenchLevel.length === 0 ? (
                  publicFrenchLevel
                ) : (
                  <FRLink
                    href={isEditMode ? "#" : getFrenchLevelLink(publicFrenchLevel)}
                    onClick={() => Event("DISPO_VIEW", "click french level", "Left sidebar")}
                  >
                    {getFrenchLevel(publicFrenchLevel, t)}
                  </FRLink>
                )
              ) : undefined}
            </MetaDataItem>
          ) : null}

          {isEditMode || publicAge ? (
            <MetaDataItem
              icon="fr-icon-parent-line"
              title={t("Infocards.age")}
              state={formSubmitted && publicAge === undefined ? "invalid" : undefined}
              onClick={
                isEditMode
                  ? () => {
                      setModalPage?.(4);
                      setActiveModal?.("Public");
                    }
                  : undefined
              }
            >
              {publicAge === null ? (
                "Non pertinent pour mon action"
              ) : publicAge ? (
                <FRLink href={isEditMode ? "#" : getAgeLink(publicAge)}>
                  {getAge(publicAge, t)}
                </FRLink>
              ) : undefined}
            </MetaDataItem>
          ) : null}
        </MetaDataCard>
      ) : null}
    </>
  );
};

export default CardPublic;
