import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Input, Row } from "reactstrap";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";
import { cls } from "lib/classname";
import FButton from "components/UI/FButton/FButton";
import { dispositifSelector } from "services/AllDispositifs/allDispositifs.selector";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import { activeUsersSelector } from "services/AllUsers/allUsers.selector";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { Log } from "types/interface";
import API from "utils/API";
import { LogList } from "../../Logs/LogList";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import { UserButton } from "../../sharedComponents/UserButton";
import { getUsersToSendMail, getFormattedStatus, getTitle } from "./functions";
import modalStyles from "../../sharedComponents/DetailsModal.module.scss";
import styles from "./ImprovementsMailModal.module.scss";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositifId: ObjectId | null;
}

export const ImprovementsMailModal = (props: Props) => {
  const { selectedDispositifId } = props;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));

  const updateLogs = useCallback(() => {
    if (selectedDispositifId) {
      API.logs(selectedDispositifId).then((res) => {
        setLogs(
          res.data.data
            // keep only improvement logs
            .filter((log: Log) => log?.link?.next === "ModalImprovements")
        );
      });
    }
  }, [selectedDispositifId]);

  useEffect(() => {
    updateLogs();
  }, [updateLogs]);

  const users = useSelector(activeUsersSelector);
  const structures = useSelector(allStructuresSelector);

  const isLoadingDispositifs = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));
  const isLoadingUsers = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS));
  const isLoadingStructures = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  const isLoading = isLoadingDispositifs || isLoadingUsers || isLoadingStructures;

  if (isLoading) {
    return (
      <DetailsModal show={props.show} toggleModal={props.toggleModal} isLoading={true} leftHead={null} rightHead={null}>
        <div></div>
      </DetailsModal>
    );
  }

  if (!props.selectedDispositifId || !dispositif) {
    return (
      <DetailsModal
        show={props.show}
        toggleModal={props.toggleModal}
        isLoading={false}
        leftHead={null}
        rightHead={null}
      >
        <div>Erreur</div>
      </DetailsModal>
    );
  }

  // eslint-disable-next-line
  const usersToDisplay = getUsersToSendMail(
    dispositif.status,
    dispositif.creatorId,
    dispositif.mainSponsor,
    users,
    structures
  );

  const formattedStatus = getFormattedStatus(dispositif.status);
  const formattedStatusStructure = dispositif.mainSponsor && getFormattedStatus(dispositif.mainSponsor.status);

  const title = getTitle(dispositif.titreInformatif, dispositif.typeContenu, dispositif.titreMarque);

  const mainSponsorName =
    dispositif && dispositif.mainSponsor && dispositif.mainSponsor.nom ? dispositif.mainSponsor.nom : "";

  const dispositifCategories = [
    "C'est quoi ?",
    "C'est pour qui ?",
    "Pourquoi c'est intéressant ?",
    "Comment je m'engage ?",
    "Carte interactive"
  ];

  const onClickCategory = (categorie: string) => {
    const isCategorieSelected = selectedCategories.filter((cat) => cat === categorie).length > 0;
    if (isCategorieSelected) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== categorie));
      return;
    }
    const newCategories = selectedCategories.concat([categorie]);
    setSelectedCategories(newCategories);
    return;
  };

  const sendMail = () => {
    const data = {
      dispositifId: dispositif._id,
      users: usersToDisplay
        .filter((user) => user.email)
        .map((user) => ({
          username: user.username,
          _id: user._id,
          email: user.email
        })),
      titreInformatif: dispositif.titreInformatif,
      titreMarque: dispositif.titreMarque,
      sections: selectedCategories,
      message
    };

    API.sendAdminImprovementsMail(data)
      .then(() => {
        Swal.fire({
          title: "Yay...",
          text: "Mail(s) envoyé(s)",
          icon: "success",
          timer: 1500
        });
        props.toggleModal();
      })
      .catch(() => {
        Swal.fire({
          title: "Oh non",
          text: "Erreur lors de l'envoi",
          icon: "error",
          timer: 1500
        });
        props.toggleModal();
      });
  };

  const nbUsersWithEmail = usersToDisplay.filter((user) => user.email).length;

  return (
    <DetailsModal show={props.show} toggleModal={props.toggleModal} isLoading={false} leftHead={null} rightHead={null}>
      <Row>
        <Col lg="8">
          <div className={cls(modalStyles.title, "mb-4")}>
            <h2 className="ms-0">Demande d'informations complémentaires</h2>
          </div>
          <p className={cls(styles.infoline, styles.text)}>
            <span className="me-3">
              Fiche : <strong>{title}</strong>
            </span>
            <StyledStatus
              text={formattedStatus.displayedStatus}
              textToDisplay={formattedStatus.displayedStatus}
              color={formattedStatus.color}
              disabled={true}
              textColor={formattedStatus.textColor}
            />
          </p>

          <p className={cls(styles.infoline, styles.text)}>
            <span className="me-3">
              Structure : <strong>{mainSponsorName}</strong>
            </span>
            {formattedStatusStructure && (
              <StyledStatus
                text={formattedStatusStructure.displayedStatus}
                textToDisplay={formattedStatusStructure.displayedStatus}
                color={formattedStatusStructure.color}
                disabled={true}
                textColor={formattedStatusStructure.textColor}
              />
            )}
          </p>

          <p className={cls(styles.text, "mb-3")}>La demande sera envoyée à :</p>

          {usersToDisplay.map((user, index) => (
            <UserButton key={index} user={user} tags={user.roles} wrap={true} />
          ))}

          <Row className="mt-6">
            <Col lg="4">
              <p className={cls(styles.text, "mb-3")}>{"Sections à revoir (" + selectedCategories.length + ")"} </p>
              <div className={styles.categories}>
                {dispositifCategories.map((category, index) => (
                  <FButton
                    className={styles.category}
                    key={index}
                    type={selectedCategories.includes(category) ? "dark" : "white"}
                    onClick={() => onClickCategory(category)}
                  >
                    {category}
                  </FButton>
                ))}
              </div>
            </Col>
            <Col lg="8">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <p className={cls(styles.text, "mb-3")}>Ajouter un message</p>
                <p className={cls(styles.text, "mb-3 text-muted")}>{message.length.toString()} sur 3000 caractères</p>
              </div>
              <Input
                type="textarea"
                placeholder="Précisions sur les modifications attendues..."
                rows={10}
                maxLength={3000}
                onChange={handleChange}
                value={message}
                id="message"
                className={styles.input}
              />
            </Col>
          </Row>

          <div className={styles.recap}>
            Vous allez envoyer un mail à <b>{nbUsersWithEmail}</b> utilisateur(s) avec{" "}
            <b>{selectedCategories.length}</b> section(s) à revoir.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end"
            }}
          >
            <FButton className="me-2" type="white" onClick={props.toggleModal} name="close-outline">
              Annuler
            </FButton>
            <FButton
              type="validate"
              name="checkmark-outline"
              onClick={sendMail}
              disabled={nbUsersWithEmail === 0 || selectedCategories.length === 0}
            >
              Envoyer
            </FButton>
          </div>
        </Col>
        <Col lg="4">
          <div className={cls(modalStyles.title, "mb-4")}>
            <h2>Emails envoyés</h2>
          </div>
          {logs.length > 0 && <LogList logs={logs} />}
        </Col>
      </Row>
    </DetailsModal>
  );
};
