import React from "react";
import { Col, Card, CardBody, CardFooter, Spinner } from "reactstrap";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import { Props } from "./TopRightHeader.container";
import { isUserAllowedToModify } from "./functions";
import { isMobile } from "react-device-detect";
import { ContribStyledStatus } from "../../../../containers/Backend/UserContributions/components/SubComponents";

export interface PropsBeforeInjection {
  disableEdit: boolean;
  withHelp: boolean;
  showSpinnerBookmark: boolean;
  bookmarkDispositif: () => void;
  pinned: boolean;
  toggleHelp: () => void;
  toggleModal: (arg1: boolean, arg2: string) => void;
  toggleDispositifValidateModal: () => void;
  editDispositif: () => void;
  valider_dispositif: (arg1: string) => void;
  toggleDispositifCreateModal: () => void;
  toggleTutoModal: (section: string) => void;
  translating: boolean;
  status: string;
  typeContenu: "dispositif" | "demarche";
  langue: string;
  t: any;
}

export class TopRightHeader extends React.Component<Props> {
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
   * valider_dispositif : used to validate dispositif in Brouillon state
   * toggleDispositifCreateModal : toggle modal to explain how to write when clicking on 'Besoin d'aide'
   * translating
   * status: status of the content
   */

  render() {
    const props = this.props;
    const isAuthor =
      this.props.user &&
      this.props.selectedDispositif &&
      this.props.selectedDispositif.creatorId
        ? this.props.user._id ===
          (this.props.selectedDispositif.creatorId || {})._id
        : false;

    // there are 3 roles in a structure : admin = responsable, contributeur : can modify dispositifs of the structure, membre : cannot modify
    const userIsSponsor =
      this.props.user && this.props.selectedDispositif
        ? (
            (
              ((this.props.selectedDispositif.mainSponsor || {}).membres || [])
                // @ts-ignore
                .find((x) => x.userId === this.props.user._id) || {}
            ).roles || []
          ).some((y) => y === "administrateur" || y === "contributeur")
        : false;

    const isUserAllowedToModifyDispositif = isUserAllowedToModify(
      props.admin,
      userIsSponsor,
      isAuthor,
      this.props.selectedDispositif
        ? this.props.selectedDispositif.status
        : null
    );

    // user can validate a dispositif if he is admin or contributor of the mainsponsor of the dispositif
    if (props.status === "En attente" && (userIsSponsor || props.admin)) {
      // top right part of dispositif when user is sponsor and dispo is 'En attente'
      return (
        <Col xl="6" lg="6" md="6" sm="6" xs="12" className="top-right">
          <Card>
            {props.admin && (
              <div style={{ marginBottom: "8px" }}>
                <FButton
                  className="dark"
                  name="edit-outline"
                  onClick={props.editDispositif}
                >
                  Modifier la fiche
                </FButton>
              </div>
            )}
            <CardBody className="backgroundColor-lightColor">
              <span className="validate-header">
                Souhaitez-vous récupérer ce contenu ?
              </span>
              <FButton
                type="validate"
                className="mt-10 full-width"
                onClick={() => props.toggleModal(true, "responsable")}
              >
                Oui
              </FButton>
              <FButton
                type="error"
                className="mt-10 full-width"
                onClick={() => props.toggleModal(true, "rejection")}
              >
                Non
              </FButton>
            </CardBody>
            <CardFooter
              className="color-darkColor cursor-pointer"
              onClick={props.toggleDispositifCreateModal}
            >
              <EVAIcon
                className="mr-8"
                name="question-mark-circle"
                viewBox="0 0 20 20"
                size="medium"
              />
              Besoin d'aide ?
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
        <Col xl="6" lg="6" md="6" sm="6" xs="12" className="top-right-edition">
          {!props.translating &&
            props.langue === "fr" &&
            (props.admin || isAuthor || userIsSponsor) &&
            !isMobile && (
              <div
                onClick={(event: any) => {
                  event.stopPropagation();
                  props.toggleTutoModal("Statut des fiches");
                }}
                className="top-icon-wrapper button"
              >
                <ContribStyledStatus size="large" text={props.status} />
              </div>
            )}
          {!props.translating &&
            props.langue === "fr" &&
            isUserAllowedToModifyDispositif && (
              <div className="top-icon-wrapper button">
                <FButton
                  className="dark"
                  name="edit-outline"
                  onClick={props.editDispositif}
                >
                  Modifier la fiche
                </FButton>
              </div>
            )}
          {this.props.selectedDispositif &&
            this.props.selectedDispositif.status === "Actif" && (
              <div
                className="top-icon-wrapper button"
                onClick={props.bookmarkDispositif}
              >
                {props.showSpinnerBookmark ? (
                  <Spinner color="success" />
                ) : (
                  <FButton
                    className="default"
                    name={"star" + (props.pinned ? "" : "-outline")}
                  >
                    {props.pinned
                      ? props.t(
                          "Dispositif.Enlever des favoris",
                          "Enlever des favoris"
                        )
                      : props.t(
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

    return false;
  }
}
