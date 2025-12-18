import { DispositifStatus, type UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useContext, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import Tooltip from "~/components/UI/Tooltip";
import { isStatus } from "~/lib/dispositif";
import { allStructuresSelector } from "~/services/AllStructures/allStructures.selector";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import PageContext from "~/utils/pageContext";
import DeleteContentModal from "./DeleteContentModal";

interface Props {
  formData: UpdateDispositifRequest;
  id?: string;
}

const CardMainSponsor = ({ formData, id }: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const { setValue } = useFormContext();
  const { setActiveModal } = useContext(PageContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const structures = useSelector(allStructuresSelector);
  const sponsor = useMemo(() => {
    if (typeof formData.mainSponsor === "string") {
      const sponsor = structures.find((s) => s._id.toString() === formData.mainSponsor);
      return {
        name: sponsor?.nom,
        logo: sponsor?.picture?.secure_url,
      };
    }
    return {
      name: formData.mainSponsor?.name,
      logo: formData.mainSponsor?.logo?.secure_url,
    };
  }, [formData, structures]);

  const isAllowedToEdit = useMemo(() => {
    return (
      user.admin ||
      (!isStatus(dispositif?.status, DispositifStatus.ACTIVE) && !dispositif?.hasDraftVersion)
    );
  }, [user, dispositif]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <MetaDataCard
        title={t("Dispositif.structure")}
        onClick={isAllowedToEdit ? () => setActiveModal?.("MainSponsor") : undefined}
        onDelete={handleDelete}
        id={id}
      >
        <MetaDataItem
          logoImage={{
            url: sponsor.logo || defaultStructureImage,
            alt: sponsor.name || "",
          }}
          title={sponsor.name}
        >
          {sponsor.name}
        </MetaDataItem>
      </MetaDataCard>
      {!isAllowedToEdit && (
        <>
          <Tooltip target="main-sponsor-card">
            Vous ne pouvez plus modifier la structure liée à votre fiche une fois celle-ci publiée.
            Contactez-nous via le chat si besoin.
          </Tooltip>
        </>
      )}
      <DeleteContentModal
        show={showDeleteModal}
        toggle={() => setShowDeleteModal((o) => !o)}
        onValidate={() => {
          setValue("mainSponsor", null);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default CardMainSponsor;
