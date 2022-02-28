import React from "react";
import { useSelector } from "react-redux";
import { Col, Card, CardBody, CardFooter, Spinner } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import { isUserAllowedToModify } from "./functions";
import { isMobile } from "react-device-detect";
import { userDetailsSelector, userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { ContribStyledStatus } from "containers/Backend/UserContributions/components/SubComponents";
import styles from "./TopRightHeader.module.scss";
import { Tag } from "types/interface";
import { useTranslation } from "next-i18next";

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
  mainTag: Tag | null;
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

  const isAuthor =
    user && selectedDispositif && selectedDispositif.creatorId
      ? user._id === (selectedDispositif.creatorId || {})._id
      : false;

  // there are 3 roles in a structure : admin = responsable, contributeur : can modify dispositifs of the structure, membre : cannot modify
  const userIsSponsor =
    user && selectedDispositif
      ? (
          (
            ((selectedDispositif.mainSponsor || {}).membres || [])
              // @ts-ignore
              .find((x) => x.userId === user._id) || {}
          ).roles || []
        ).some((y) => y === "administrateur" || y === "contributeur")
      : false;

  const isUserAllowedToModifyDispositif = isUserAllowedToModify(
    admin,
    userIsSponsor,
    isAuthor,
    selectedDispositif ? selectedDispositif.status : null
  );

  // user can validate a dispositif if he is admin or contributor of the mainsponsor of the dispositif
  if (props.status === "En attente" && (userIsSponsor || admin)) {
    // top right part of dispositif when user is sponsor and dispo is 'En attente'
    return (
      <Col xl="6" lg="6" md="6" sm="6" xs="12" className={styles.top_right}>
        <Card className={styles.card}>
          {admin && (
            <div style={{ marginBottom: "8px" }}>
              <FButton
                type="dark"
                name="edit-outline"
                onClick={props.editDispositif}
              >
                Modifier la fiche
              </FButton>
            </div>
          )}
          <CardBody
            className={styles.card_body + " bg-lightColor"}
            style={{ backgroundColor: props.mainTag?.lightColor || "light" }}
          >
            <span className="text-center">
              Souhaitez-vous récupérer ce contenu ?
            </span>
            <FButton
              type="validate"
              className={styles.full_width + " mt-10"}
              onClick={() => props.toggleModal(true, "responsable")}
            >
              Oui
            </FButton>
            <FButton
              type="error"
              className={styles.full_width + " mt-10"}
              onClick={() => props.toggleModal(true, "rejection")}
            >
              Non
            </FButton>
          </CardBody>
          <CardFooter
            className={styles.card_footer}
            onClick={props.toggleDispositifCreateModal}
            style={{ color: props.mainTag?.darkColor || "dark" }}
          >
            <EVAIcon
              className="mr-8"
              name="question-mark-circle"
              size="medium"
            />
            Besoin d&apos;aide ?
          </CardFooter>
        </Card>
      </Col>
    );
  } else if (props.disableEdit && !isMobile) {
    // when props.disableEdit = true, favorite button and modify button (if user authorized)
    // user can modify a dispositif if he is admin or contributor of the mainsponsor of the dispositif OR if he is admin
    // 160920 : or autor but not when dispo if pubié, en attente admin or accepté structure
    // when site is not in french, cannot modify the text
    return (
      <Col
        xl="6"
        lg="6"
        md="6"
        sm="6"
        xs="12"
        className={styles.top_right_edition}
      >
        {!props.translating &&
          props.langue === "fr" &&
          (admin || isAuthor || userIsSponsor) &&
          !isMobile && (
            <div
              onClick={(event: any) => {
                event.stopPropagation();
                props.toggleTutoModal("Statut des fiches");
              }}
              className={styles.icon}
            >
              <ContribStyledStatus size="large" text={props.status} />
            </div>
          )}
        {!props.translating &&
          props.langue === "fr" &&
          isUserAllowedToModifyDispositif && (
            <div className={styles.icon}>
              <FButton
                type="dark"
                name="edit-outline"
                onClick={props.editDispositif}
              >
                Modifier la fiche
              </FButton>
            </div>
          )}
        {selectedDispositif &&
          selectedDispositif.status === "Actif" && (
            <div className={styles.icon} onClick={props.bookmarkDispositif}>
              {props.showSpinnerBookmark ? (
                <Spinner color="success" />
              ) : (
                <FButton
                  className="default"
                  name={"star" + (props.pinned ? "" : "-outline")}
                >
                  {props.pinned
                    ? t(
                        "Dispositif.Enlever des favoris",
                        "Enlever des favoris"
                      )
                    : t(
                        "Dispositif.Ajouter aux favoris",
                        "Ajouter aux favoris"
                      )}
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
