import { fr } from "@codegouvfr/react-dsfr";
import { ContentType, Metadatas, UpdateDispositifRequest } from "@refugies-info/api-types";
import { useCallback, useContext } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { useContentType } from "~/hooks/dispositif";
import { cls } from "~/lib/classname";
import { themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import CardAvailability from "../../Metadatas/CardAvailability";
import CardConditions from "../../Metadatas/CardConditions";
import CardDemarcheAdministration from "../../Metadatas/CardDemarcheAdministration";
import CardLocation from "../../Metadatas/CardLocation";
import CardMainSponsor from "../../Metadatas/CardMainSponsor";
import CardPrice from "../../Metadatas/CardPrice";
import CardPublic from "../../Metadatas/CardPublic";
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
import styles from "./LeftSidebarEdition.module.scss";

interface Props {
  typeContenu: ContentType;
}

/**
 * Left sidebar of the page in EDIT mode.
 * For each section, it shows either an AddContentButton if no content yet, or a card if the value is set.
 */
const LeftSidebarEdition = (props: Props) => {
  const values = useWatch<UpdateDispositifRequest>();
  const currentTheme = useSelector(themeSelector(values.theme));
  const color = currentTheme?.colors.color100 || "#000";
  const contentType = useContentType();

  const { activeModal, setActiveModal } = useContext(PageContext);
  const toggleModal = useCallback(() => setActiveModal?.(null), [setActiveModal]);

  return (
    <div className={styles.container}>
      <div id="step-theme"></div>
      {values.theme !== undefined ? (
        <CardTheme
          dataTheme={values.theme}
          dataSecondaryThemes={values.secondaryThemes}
          color={color}
          onClick={() => setActiveModal?.("Themes")}
        />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("Themes")} className="mb-6" size="md">
          <EVAIcon
            name="color-palette-outline"
            size={24}
            fill={fr.colors.decisions.text.disabled.grey.default}
            className={cls(styles.theme_icon, "me-2")}
          />
          Thèmes
        </AddContentButton>
      )}

      {contentType === ContentType.DEMARCHE && (
        <>
          {values.administration !== undefined &&
          (values.administration?.name !== undefined || values?.administration?.logo !== undefined) ? (
            <CardDemarcheAdministration
              dataAdministration={values.administration}
              color={color}
              onClick={() => setActiveModal?.("Administration")}
            />
          ) : (
            <AddContentButton onClick={() => setActiveModal?.("Administration")} className="mb-6" size="md">
              <i className="fr-icon-image-line me-2" />
              Administration (optionnel)
            </AddContentButton>
          )}
        </>
      )}

      <p className={styles.title}>C'est pour qui ?</p>

      <div id="step-public"></div>
      {values.metadatas?.publicStatus !== undefined ||
      values.metadatas?.age !== undefined ||
      values.metadatas?.frenchLevel !== undefined ||
      values.metadatas?.public !== undefined ? (
        <CardPublic
          dataPublicStatus={values.metadatas.publicStatus}
          dataAge={values.metadatas.age as Metadatas["age"]}
          dataFrenchLevel={values.metadatas.frenchLevel}
          dataPublic={values.metadatas.public}
          color={color}
          onClick={() => setActiveModal?.("Public")}
        />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("Public")} className="mb-6" size="md">
          Public visé
        </AddContentButton>
      )}

      <div id="step-price"></div>
      {values.metadatas?.price !== undefined ? (
        <CardPrice
          data={values.metadatas.price as Metadatas["price"]}
          color={color}
          onClick={() => setActiveModal?.("Price")}
        />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("Price")} className="mb-6" size="md">
          Prix
        </AddContentButton>
      )}

      {contentType === ContentType.DISPOSITIF && (
        <>
          <div id="step-commitment"></div>
          {values.metadatas?.commitment !== undefined ||
          values.metadatas?.frequency !== undefined ||
          values.metadatas?.timeSlots !== undefined ? (
            <CardAvailability
              dataCommitment={values.metadatas.commitment as Metadatas["commitment"]}
              dataFrequency={values.metadatas.frequency as Metadatas["frequency"]}
              dataTimeSlots={values.metadatas.timeSlots}
              color={color}
              onClick={() => setActiveModal?.("Availability")}
            />
          ) : (
            <AddContentButton onClick={() => setActiveModal?.("Availability")} className="mb-6" size="md">
              Disponibilité demandée
            </AddContentButton>
          )}
        </>
      )}

      <div id="step-conditions"></div>
      {values.metadatas?.conditions !== undefined ? (
        <CardConditions
          data={values.metadatas.conditions}
          color={color}
          onClick={() => setActiveModal?.("Conditions")}
        />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("Conditions")} className="mb-6" size="md">
          Conditions
        </AddContentButton>
      )}

      {contentType === ContentType.DISPOSITIF && (
        <>
          <div id="step-location"></div>
          {values.metadatas?.location !== undefined ? (
            <CardLocation
              data={values.metadatas.location}
              typeContenu={props.typeContenu || ContentType.DISPOSITIF}
              color={color}
              onClick={() => setActiveModal?.("Location")}
            />
          ) : (
            <AddContentButton onClick={() => setActiveModal?.("Location")} className="mb-6" size="md">
              C'est où ?
            </AddContentButton>
          )}
        </>
      )}

      <p className={styles.title}>À faire en dernier</p>

      <div id="step-mainSponsor"></div>
      {!!values.mainSponsor ? (
        <CardMainSponsor
          dataMainSponsor={values.mainSponsor}
          color={color}
          onClick={() => setActiveModal?.("MainSponsor")}
        />
      ) : (
        <AddContentButton onClick={() => setActiveModal?.("MainSponsor")} size="md" className="mb-6">
          <EVAIcon
            name="home-outline"
            size={24}
            fill={fr.colors.decisions.text.disabled.grey.default}
            className={cls(styles.theme_icon, "me-2")}
          />
          Structure
        </AddContentButton>
      )}

      <div id="step-abstract"></div>
      <AddContentButton
        onClick={() => setActiveModal?.("Abstract")}
        size="md"
        contentSize="sm"
        content={values.abstract}
      >
        <EVAIcon
          name="file-text-outline"
          size={24}
          fill={fr.colors.decisions.text.disabled.grey.default}
          className={cls(styles.theme_icon, "me-2")}
        />
        En bref
      </AddContentButton>

      <ModalAvailability show={activeModal === "Availability"} toggle={toggleModal} />
      <ModalConditions show={activeModal === "Conditions"} toggle={toggleModal} />
      <ModalLocation show={activeModal === "Location"} toggle={toggleModal} />
      <ModalPrice show={activeModal === "Price"} toggle={toggleModal} />
      <ModalPublic show={activeModal === "Public"} toggle={toggleModal} />
      <ModalThemes show={activeModal === "Themes"} toggle={toggleModal} />
      <ModalAbstract show={activeModal === "Abstract"} toggle={toggleModal} />
      <ModalMainSponsor show={activeModal === "MainSponsor"} toggle={toggleModal} />
      <ModalDemarcheAdministration show={activeModal === "Administration"} toggle={toggleModal} />
    </div>
  );
};

export default LeftSidebarEdition;
