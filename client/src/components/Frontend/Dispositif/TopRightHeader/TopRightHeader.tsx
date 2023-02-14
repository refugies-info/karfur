//@ts-nocheck TODO: delete
import React from "react";
import { useSelector } from "react-redux";
import { Col, Card, CardBody, CardFooter, Spinner } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import { isUserAllowedToModify, isUserAuthor, isUserSponsor } from "./functions";
import { userDetailsSelector, userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { ContribStyledStatus } from "containers/Backend/UserContributions/components/SubComponents";
import { Theme } from "types/interface";
import { useTranslation } from "next-i18next";
import styles from "./TopRightHeader.module.scss";
import mobile from "scss/components/mobile.module.scss";
import { cls } from "lib/classname";

interface Props {
  disableEdit: boolean;
  withHelp: boolean;
  showSpinnerBookmark: boolean;
  bookmarkDispositif: () => void;
  pinned: boolean;
  toggleHelp: () => void;
  toggleModal: (arg1: boolean, arg2: string) => void;
  toggleDispositifValidateModal: () => void;
  editDispositif: () => void;
  toggleDispositifCreateModal: () => void;
  toggleTutoModal: (section: string) => void;
  translating: boolean;
  status: string;
  typeContenu: "dispositif" | "demarche";
  langue: string;
  mainTheme: Theme | null;
}

/**
 * props explanations :
 * disableEdit = true --> lecture, disableEdit = false --> edit or creation
 * withHelp =true --> activate help, false --> desactivate
 * showSpinnerBookmark : boolean : deal with spinner when add a favorite
 * bookmarkDispositif : called when adding a new favorite
 * pinned : boolean, bookmark empty or not
 * toggleHelp : add or remove help
 * toggleModal : toggle modal to accept or not content (for a sponsor and status 'En attente')
 * toggleDispositifValidateModal : toggle modal to attach dispositif to structure
 * editDispositif  : when click on pen button to modify dispositif
 * toggleDispositifCreateModal : toggle modal to explain how to write when clicking on 'Besoin d'aide'
 * translating
 * status: status of the content
 */
const TopRightHeader = (props: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userDetailsSelector);
  const admin = useSelector(userSelector).admin;
  const selectedDispositif = useSelector(selectedDispositifSelector);

  const isAuthor = isUserAuthor(user, selectedDispositif);
  const userIsSponsor = isUserSponsor(user, selectedDispositif);
  const isUserAllowedToModifyDispositif = isUserAllowedToModify(admin, user, selectedDispositif);

  // user can validate a dispositif if he is admin or contributor of the mainsponsor of the dispositif
  if (props.status === "En attente" && (userIsSponsor || admin)) {
    // top right part of dispositif when user is sponsor and dispo is 'En attente'
    return (
      <Col xl="6" lg="6" md="6" sm="6" xs="12" className={styles.top_right}>
        <Card className={styles.card}>
          {admin && (
            <div style={{ marginBottom: "8px" }}>
              <FButton type="dark" name="edit-outline" onClick={props.editDispositif}>
                Modifier la fiche
              </FButton>
            </div>
          )}
          <CardBody
            className={styles.card_body + " bg-lightColor"}
            style={{ backgroundColor: props.mainTheme?.colors.color30 || "light" }}
          >
            <span className="text-center">Souhaitez-vous récupérer ce contenu ?</span>
            <FButton
              type="validate"
              className={styles.full_width + " mt-2"}
              onClick={() => props.toggleModal(true, "responsable")}
            >
              Oui
            </FButton>
            <FButton
              type="error"
              className={styles.full_width + " mt-2"}
              onClick={() => props.toggleModal(true, "rejection")}
            >
              Non
            </FButton>
          </CardBody>
          <CardFooter
            className={styles.card_footer}
            onClick={props.toggleDispositifCreateModal}
            style={{ color: props.mainTheme?.colors.color100 || "dark" }}
          >
            <EVAIcon className="me-2" name="question-mark-circle" size="medium" />
            Besoin d&apos;aide ?
          </CardFooter>
        </Card>
      </Col>
    );
  } else if (props.disableEdit) {
    // when props.disableEdit = true, favorite button and modify button (if user authorized)
    // user can modify a dispositif if he is admin or contributor of the mainsponsor of the dispositif OR if he is admin
    // 160920 : or autor but not when dispo if pubié, en attente admin or accepté structure
    // when site is not in french, cannot modify the text
    return (
      <Col xl="6" lg="6" md="6" sm="6" xs="12" className={cls(mobile.hidden_flex, styles.top_right_edition)}>
        {!props.translating && props.langue === "fr" && (admin || isAuthor || userIsSponsor) && (
          <div
            onClick={(event: any) => {
              event.stopPropagation();
              props.toggleTutoModal("Statut des fiches");
            }}
            className={cls(mobile.hidden, styles.icon)}
          >
            <ContribStyledStatus size="large" text={props.status} />
          </div>
        )}
        {!props.translating && props.langue === "fr" && isUserAllowedToModifyDispositif && (
          <div className={styles.icon}>
            <FButton type="dark" name="edit-outline" onClick={props.editDispositif}>
              Modifier la fiche
            </FButton>
          </div>
        )}
        {selectedDispositif && selectedDispositif.status === "Actif" && (
          <div className={styles.icon} onClick={props.bookmarkDispositif}>
            {props.showSpinnerBookmark ? (
              <Spinner color="success" />
            ) : (
              <FButton className="default" name={"star" + (props.pinned ? "" : "-outline")}>
                {props.pinned
                  ? t("Dispositif.Enlever des favoris", "Enlever des favoris")
                  : t("Dispositif.Ajouter aux favoris", "Ajouter aux favoris")}
              </FButton>
            )}
          </div>
        )}
      </Col>
    );
  }

  return null;
};

export default TopRightHeader;
