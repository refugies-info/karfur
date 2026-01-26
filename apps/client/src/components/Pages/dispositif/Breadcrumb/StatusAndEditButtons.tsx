import {
  ContentType,
  DispositifStatus,
  type GetDispositifResponse,
} from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { canEdit, isStatus } from "~/lib/dispositif";
import { userSelector } from "~/services/User/user.selectors";
import PageContext from "~/utils/pageContext";
import Status from "../Status";
import EditModal from "./EditModal";

interface Props {
  dispositif: GetDispositifResponse;
}

const StatusAndEditButtons = ({ dispositif }: Props) => {
  const user = useSelector(userSelector);
  const { isTablet } = useWindowSize();
  const pageContext = useContext(PageContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();
  const navigateToEdit = () => {
    if (!dispositif._id) return;
    router.push({
      pathname:
        dispositif.typeContenu === ContentType.DEMARCHE
          ? getPath("/demarche/[id]/edit", "fr")
          : getPath("/dispositif/[id]/edit", "fr"),
      query: { id: dispositif._id.toString() },
    });
  };
  const onEditClick = () => {
    if (isStatus(dispositif.status, DispositifStatus.ACTIVE)) {
      setShowEditModal(true);
    } else {
      navigateToEdit();
    }
  };

  return (
    <>
      {!isTablet && canEdit(dispositif, user.user) && pageContext.mode === "view" && (
        <>
          <Status
            status={dispositif.status}
            hasDraftVersion={!!dispositif.hasDraftVersion}
            isAdmin={user.admin}
            className="me-4"
            text={router.pathname.includes("/preview") ? "PRÉVISUALISATION" : undefined}
          />
          {!router.pathname.includes("/preview") && (
            <button
              className="fr-btn fr-btn--icon-right fr-icon-edit-line fr-btn--sm"
              onClick={onEditClick}
            >
              Modifier la fiche
            </button>
          )}
          <EditModal
            show={showEditModal}
            toggle={() => setShowEditModal((o) => !o)}
            onValidate={navigateToEdit}
          />
        </>
      )}
    </>
  );
};

export default StatusAndEditButtons;
