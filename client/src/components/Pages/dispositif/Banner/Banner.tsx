import React, { useCallback, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Badge } from "@dataesr/react-dsfr";
import { DispositifStatus, Id } from "api-types";
import { getPath } from "routes";
import { isStatus } from "lib/dispositif";
import PageContext from "utils/pageContext";
import { themeSelector } from "services/Themes/themes.selectors";
import { userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import { getStatus } from "./functions";
import EditModal from "./EditModal";
import styles from "./Banner.module.scss";

interface Props {
  themeId: Id | undefined;
}

/**
 * Top level banner with theme image or default one. Includes edit button and status if logged in
 */
const Banner = (props: Props) => {
  const theme = useSelector(themeSelector(props.themeId));
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const status = getStatus(dispositif?.status, user.admin);
  const pageContext = useContext(PageContext);

  // edit
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const navigateToEdit = useCallback(() => {
    if (!dispositif?._id) return;
    router.push({
      pathname: getPath("/dispositif/[id]/edit", router.locale),
      query: { id: dispositif._id.toString() },
    });
  }, [dispositif, router]);

  const onEditClick = useCallback(() => {
    if (
      isStatus(dispositif?.status, [
        DispositifStatus.ACTIVE,
        DispositifStatus.WAITING_ADMIN,
        DispositifStatus.WAITING_STRUCTURE,
      ])
    ) {
      setShowEditModal(true);
    } else {
      navigateToEdit();
    }
  }, [dispositif, navigateToEdit]);

  return (
    <div
      className={styles.banner}
      style={theme?.banner.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}}
    >
      {/* TODO: check that user is authorized to edit */}
      {user && pageContext.mode === "view" && (
        <>
          <div className={styles.actions}>
            {status && <Badge text={status.text} type={status.type} hasIcon icon={status.icon} className="me-4" />}
            <Button icon="edit-outline" className={styles.edit} onClick={onEditClick}>
              Modifier la fiche
            </Button>
          </div>
          <EditModal
            show={showEditModal}
            toggle={() => setShowEditModal((o) => !o)}
            onValidate={navigateToEdit}
            status={dispositif?.status || null}
          />
        </>
      )}
    </div>
  );
};

export default Banner;
