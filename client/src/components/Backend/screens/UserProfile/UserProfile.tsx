import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StructureMemberRole } from "@refugies-info/api-types";
import { Col, Row } from "reactstrap";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { logger } from "logger";
import API from "utils/API";
import { cls } from "lib/classname";
import { userDetailsSelector, userSelector } from "services/User/user.selectors";
import { userStructureRoleSelector, userStructureSelector } from "services/UserStructure/userStructure.selectors";
import {
  EditAvatar,
  EditButton,
  LanguageBadge,
  ModalDepartments,
  modalDepartments,
  ModalLanguage,
  modalLanguage,
  Tag,
  UserProfileForm,
} from "./components";
import styles from "./UserProfile.module.scss";

interface Props {
  title: string;
}

export const UserProfile = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const userDetails = useSelector(userDetailsSelector);
  const userStructure = useSelector(userStructureSelector);
  const userStructureRole = useSelector(userStructureRoleSelector);

  const [edition, setEdition] = useState(false);
  const [newsletter, setNewsletter] = useState<boolean | null>(null);
  const [nbWordsTranslated, setNbWordsTranslated] = useState<number | null>(null);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    if (!userDetails) return;
    API.isInContacts().then((res) => setNewsletter(res.isInContacts));
  }, [dispatch, user, userDetails, nbWordsTranslated]);

  const subscribeNewsletter = async (checked: boolean) => {
    if (!userDetails?.email) return;
    setNewsletter(checked);
    try {
      if (checked) {
        await API.contacts({ email: userDetails.email });
      } else {
        await API.deleteContact();
      }
    } catch (e: any) {
      logger.error(e);
    }
  };

  // Load user stats
  useEffect(() => {
    if (!userDetails) return;
    const loadIndicators = async () => {
      if (user.traducteur || user.expertTrad) {
        const data = await API.get_progression({ onlyTotal: true });
        setNbWordsTranslated(data?.totalIndicator?.wordsCount || 0);
      }
    };
    if (nbWordsTranslated === null) {
      loadIndicators();
    }
  }, [dispatch, user, userDetails, nbWordsTranslated]);

  if (!userDetails) return <div>Une erreur est survenue, veuillez recharger la page&nbsp;!</div>;

  return (
    <div className={cls(styles.container, edition && styles.edit)}>
      <div className={styles.wrapper}>
        <Row className="mb-10 align-items-center">
          <Col>
            <h1>Mon profil</h1>
          </Col>
          <Col className="text-end text-nowrap">
            {/* <Button
              disabled={edition}
              priority="secondary"
              size="small"
              iconId="fr-icon-error-warning-line"
              iconPosition="right"
              className={cls(styles.danger, "ms-2")}
            >
              Supprimer mon profil
            </Button> */}
          </Col>
        </Row>

        <Row>
          <Col className="flex-grow-0">
            <h2>Photo de profil</h2>
            <div className={styles.block}>
              <EditAvatar />
            </div>

            {(nbWordsTranslated !== null ||
              userStructure ||
              (user.caregiver && userDetails.partner) ||
              user.admin ||
              user.expertTrad) && <h2 className="my-6">Activité</h2>}
            {nbWordsTranslated !== null && (
              <div className={styles.info}>
                <label>Nombre de mots traduits</label>
                <p>{nbWordsTranslated}</p>
              </div>
            )}
            {userStructure && (
              <div className={styles.info}>
                <label>Structure</label>
                <p>{userStructure.nom}</p>
                {userStructureRole?.includes(StructureMemberRole.ADMIN) && (
                  <Badge severity="success" noIcon className="mt-2" as="span">
                    Responsable
                  </Badge>
                )}
              </div>
            )}

            {user.caregiver && userDetails.partner && (
              <div className={styles.info}>
                <label>Structure partenaire</label>
                <p>{userDetails.partner}</p>
              </div>
            )}

            {(user.admin || user.expertTrad) && (
              <div className={styles.info}>
                <label className="mb-2">Rôles exceptionnels</label>
                {user.admin && <Tag className="w-100 mb-2">Administrateur</Tag>}
                {user.expertTrad && <Tag className="w-100">Expert en traduction</Tag>}
              </div>
            )}
          </Col>

          <Col>
            <UserProfileForm edition={edition} setEdition={setEdition} />

            <h2>Préférences</h2>
            <div className={cls(styles.block, "mb-4")}>
              <div className="d-flex justify-content-between mb-3">
                <label className={styles.label}>Départements pour la recherche</label>
                <EditButton icon="map" onClick={() => modalDepartments.open()} />
              </div>
              {!userDetails.departments ? (
                <p className={styles.empty}>Non défini</p>
              ) : (
                userDetails.departments.map((dep, i) => (
                  <Tag key={i} className="me-1 mt-1">
                    {dep}
                  </Tag>
                ))
              )}
            </div>

            {(user.traducteur || user.expertTrad) && (
              <div className={cls(styles.block, "mb-4")}>
                <div className="d-flex justify-content-between mb-4">
                  <label className={styles.label}>Langues de traduction</label>
                  <EditButton icon="translate" onClick={() => modalLanguage.open()} />
                </div>
                {!userDetails.selectedLanguages ? (
                  <p className={styles.empty}>Non défini</p>
                ) : (
                  userDetails.selectedLanguages.map((ln, i) => <LanguageBadge key={i} id={ln} />)
                )}
              </div>
            )}

            <div className={styles.block}>
              <label className={cls(styles.label, "mb-2")} htmlFor="newsletter">
                Communication par email
              </label>

              <ToggleSwitch
                label={
                  <span>
                    <strong>La lettre d’information de Réfugiés.info</strong> : actualités, nouveaux contenus, mises à
                    jour, événements.
                  </span>
                }
                helperText="Maximum 1 fois par mois"
                checked={!!newsletter}
                onChange={subscribeNewsletter}
                disabled={newsletter === null}
                showCheckedHint={false}
              />
            </div>
          </Col>
        </Row>
      </div>

      <ModalDepartments />
      <ModalLanguage />
    </div>
  );
};

export default UserProfile;
