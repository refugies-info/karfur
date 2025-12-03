import { fr } from "@codegouvfr/react-dsfr";
import { ContentType, type UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard } from "@refugies-info/ui";
import { useCallback, useContext, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import CardInfo from "~/components/Pages/dispositif/Metadatas/CardInfo";
import CardMainSponsor from "~/components/Pages/dispositif/Metadatas/CardMainSponsor";
import CardPublic from "~/components/Pages/dispositif/Metadatas/CardPublic";
import EVAIcon from "~/components/UI/EVAIcon";
import { useContentType } from "~/hooks/dispositif";
import { cn } from "~/lib/classname";
import { themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import CardConditions from "../../Metadatas/CardConditions";
import CardDemarcheAdministration from "../../Metadatas/CardDemarcheAdministration";
import CardTheme from "../../Metadatas/CardTheme";
import AddContentButton from "../AddContentButton";
import {
  ModalAbstract,
  ModalAvailability,
  ModalConditions,
  ModalDemarcheAdministration,
  ModalLocation,
  ModalMainSponsor,
  ModalPrice,
  ModalPublic,
  ModalThemes,
} from "../Modals";

interface Props {
  typeContenu: ContentType;
  className?: string;
}

/**
 * Left sidebar of the page in EDIT mode.
 * For each section, it shows either an AddContentButton if no content yet, or a card if the value is set.
 */
const LeftSidebarEdition = ({ typeContenu, className }: Props) => {
  const values = useWatch<UpdateDispositifRequest>();

  // Create a safe version of the form data that conforms to the expected types
  const formData = useMemo(() => {
    return values as UpdateDispositifRequest;
  }, [values]);
  const currentTheme = useSelector(themeSelector(values.theme));
  const color = currentTheme?.colors.color100 || "#000";
  const contentType = useContentType();

  const { activeModal, setActiveModal, modalPage, setModalPage, formSubmitted } =
    useContext(PageContext);
  const toggleModal = useCallback(() => setActiveModal?.(null), [setActiveModal]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <CardTheme formData={formData} />
      {contentType === ContentType.DEMARCHE && (
        <>
          {values.administration !== undefined &&
          (!!values.administration?.name || !!values?.administration?.logo) ? (
            <CardDemarcheAdministration formData={formData} />
          ) : (
            <AddContentButton
              onClick={() => setActiveModal?.("Administration")}
              className="mb-6"
              size="md"
            >
              <i className="fr-icon-image-line me-2" />
              Administration (optionnel)
            </AddContentButton>
          )}
        </>
      )}
      <CardPublic id="step-public" formData={formData} />
      <CardInfo id="step-info" formData={formData} />
      <CardConditions id="step-conditions" formData={formData} />
      <p className="mb-0 font-bold">À faire en dernier</p>
      <div id="main-sponsor-card" />
      {values.mainSponsor ? (
        <CardMainSponsor formData={formData} id="step-mainSponsor" />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("MainSponsor")} size="md">
          <EVAIcon
            name="home-outline"
            size={24}
            fill={fr.colors.decisions.text.disabled.grey.default}
            className={cn("me-2")}
          />
          Structure
        </AddContentButton>
      )}
      <MetaDataCard
        state={formSubmitted && !values.abstract ? "invalid" : undefined}
        title="En bref"
        onClick={() => setActiveModal?.("Abstract")}
        id="step-abstract"
      >
        {values.abstract}
      </MetaDataCard>
      <ModalAvailability show={activeModal === "Availability"} toggle={toggleModal} />
      <ModalConditions show={activeModal === "Conditions"} toggle={toggleModal} />
      <ModalLocation show={activeModal === "Location"} toggle={toggleModal} />
      <ModalPrice show={activeModal === "Price"} toggle={toggleModal} />
      <ModalPublic show={activeModal === "Public"} toggle={toggleModal} page={modalPage} />
      <ModalThemes show={activeModal === "Themes"} toggle={toggleModal} />
      <ModalAbstract show={activeModal === "Abstract"} toggle={toggleModal} />
      <ModalMainSponsor show={activeModal === "MainSponsor"} toggle={toggleModal} />
      <ModalDemarcheAdministration show={activeModal === "Administration"} toggle={toggleModal} />
    </div>
  );
};

export default LeftSidebarEdition;
