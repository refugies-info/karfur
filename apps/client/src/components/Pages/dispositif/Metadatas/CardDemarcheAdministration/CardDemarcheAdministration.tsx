import { DispositifStatus, type UpdateDispositifRequest } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useContext, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import { isStatus } from "~/lib/dispositif";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import PageContext from "~/utils/pageContext";
import DeleteContentModal from "./DeleteContentModal";

interface Props {
  formData: UpdateDispositifRequest;
}

const CardDemarcheAdministration = ({ formData }: Props) => {
  const user = useSelector(userSelector);
  const { setValue } = useFormContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispositifSelector = useSelector(selectedDispositifSelector);
  const dispositif = formData ? formData : dispositifSelector;
  const { setActiveModal } = useContext(PageContext);

  const dataAdministration = dispositif?.administration;

  const isAllowedToEdit = useMemo(() => {
    return (
      user.admin ||
      (!isStatus(dispositifSelector?.status, DispositifStatus.ACTIVE) &&
        !dispositifSelector?.hasDraftVersion)
    );
  }, [user, dispositifSelector]);

  return (
    <>
      <MetaDataCard title="Administration" onDelete={() => setShowDeleteModal(true)}>
        <MetaDataItem
          logoImage={{
            url: dataAdministration?.logo?.secure_url || defaultStructureImage,
            alt: dataAdministration?.name || "",
          }}
          title={dataAdministration?.name || ""}
          onClick={isAllowedToEdit ? () => setActiveModal?.("Administration") : undefined}
        />
      </MetaDataCard>
      <DeleteContentModal
        show={showDeleteModal}
        toggle={() => setShowDeleteModal((o) => !o)}
        onValidate={() => {
          setValue("administration", { name: null, logo: null });
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default CardDemarcheAdministration;
