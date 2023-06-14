import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { ContentType, DispositifStatus, Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { getPath } from "routes";
import { useLanguages } from "hooks";
import { canEdit, isStatus } from "lib/dispositif";
import { cls } from "lib/classname";
import PageContext from "utils/pageContext";
import { themeSelector } from "services/Themes/themes.selectors";
import { userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import Status from "../Status";
import EditModal from "./EditModal";
import styles from "./Banner.module.scss";

interface Props {
  themeId: Id | undefined;
}

/**
 * Top level banner with theme image or default one. Includes edit button and status if logged in
 */
const Banner = (props: Props) => {
  const { t } = useTranslation();
  const theme = useSelector(themeSelector(props.themeId));
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);

  // edit
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigateToEdit = useCallback(() => {
    if (!dispositif?._id) return;
    router.push({
      pathname:
        dispositif.typeContenu === ContentType.DEMARCHE
          ? getPath("/demarche/[id]/edit", router.locale)
          : getPath("/dispositif/[id]/edit", router.locale),
      query: { id: dispositif._id.toString() },
    });
  }, [dispositif, router]);

  const onEditClick = useCallback(() => {
    if (isStatus(dispositif?.status, DispositifStatus.ACTIVE)) {
      setShowEditModal(true);
    } else {
      navigateToEdit();
    }
  }, [dispositif, navigateToEdit]);

  // ln not available
  const { currentLocale } = useLanguages();
  const isNotTranslated = useMemo(() => {
    return !(dispositif?.availableLanguages || ["fr"]).includes(router.locale || "fr");
  }, [router.locale, dispositif]);

  return (
    <div
      className={cls(styles.banner, pageContext.mode === "translate" && styles.translate)}
      style={theme?.banner?.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}}
    >
      <div>
        {isNotTranslated && (
          <Notice
            isClosable
            title={t("Dispositif.infoContentNotTranslated", {
              language: currentLocale?.langueFr?.toLowerCase() || "",
            })}
          />
        )}
        {canEdit(dispositif, user.user) && pageContext.mode === "view" && (
          <>
            <div className={styles.actions}>
              <Status
                status={dispositif?.status}
                hasDraftVersion={!!dispositif?.hasDraftVersion}
                isAdmin={user.admin}
                className="me-4"
              />
              <Button evaIcon="edit-outline" className={styles.edit} onClick={onEditClick}>
                Modifier la fiche
              </Button>
            </div>
            <EditModal show={showEditModal} toggle={() => setShowEditModal((o) => !o)} onValidate={navigateToEdit} />
          </>
        )}
      </div>
    </div>
  );
};

export default Banner;
