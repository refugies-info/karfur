import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import API from "utils/API";
import find from "lodash/find";
import { targetByTag } from "./data";
import FButton from "components/UI/FButton/FButton";
import { NoGeolocModal } from "./NoGeolocModal";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import { RegionFigures, DispositifStatistics } from "types/interface";
import { ObjectId } from "mongodb";
import { colors } from "colors";
import { Spinner } from "reactstrap";
import { themesSelector } from "services/Themes/themes.selectors";

moment.locale("fr");
const formatter = new Intl.NumberFormat();
const ACTIVES_NOTIFICATIONS = "activesNotifications";

interface Props {
  title?: string;
  visible: boolean;
}

const Dashboard = (props: Props) => {
  const [nbDispositifs, setNbDispositifs] = useState(0);
  const [nbDispositifsActifs, setNbDispositifsActifs] = useState(0);
  const [nbDemarches, setNbDemarches] = useState(0);
  const [nbDemarchesActives, setNbDemarchesActives] = useState(0);
  const [nbContributors, setNbContributors] = useState(0);
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<{
    [key: string]: number;
  }>({});
  const [nbDemarchesByTheme, setNbDemarchesByTheme] = useState<{
    [key: string]: number;
  }>({});
  const [nbTraductors, setNbTraductors] = useState(0);
  const [figuresByRegion, setFiguresByRegion] = useState<RegionFigures[]>([]);
  const [showNoGeolocModal, setShowNoGeolocModal] = useState(false);
  const [dispositifsWithoutGeoloc, setDispositifsWithoutGeoloc] = useState<ObjectId[]>([]);
  const [statistics, setStatistics] = useState<DispositifStatistics | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState<boolean | null>(null);
  const themes = useSelector(themesSelector);

  useEffect(() => {
    if (props.visible && !loaded) {
      const promises = [
        API.count_dispositifs({
          typeContenu: { $ne: "demarche" }
        }).then((data) => setNbDispositifs(data.data)),
        API.count_dispositifs({
          typeContenu: { $ne: "demarche" },
          status: "Actif"
        }).then((data) => setNbDispositifsActifs(data.data)),
        API.count_dispositifs({
          typeContenu: "demarche"
        }).then((data) => setNbDemarches(data.data)),
        API.count_dispositifs({
          typeContenu: "demarche",
          status: "Actif"
        }).then((data) => setNbDemarchesActives(data.data)),
        API.getFiguresOnUsers().then((data) => {
          setNbContributors(data.data.data.nbContributors);
          setNbTraductors(data.data.data.nbTraductors);
        }),
        API.getNbDispositifsByRegion().then((data) => {
          setFiguresByRegion(data.data.data.regionFigures);
          setDispositifsWithoutGeoloc(data.data.data.dispositifsWithoutGeoloc);
        }),
        API.getDispositifsStatistics(["nbMercis", "nbVues", "nbVuesMobile"]).then((data) => {
          setStatistics(data.data.data);
        }),
        API.getAdminOption(ACTIVES_NOTIFICATIONS).then((data) => {
          const res = data.data.data?.value;
          setNotificationsActive(res === null ? true : res);
        })
      ];

      for (const theme of themes) {
        promises.push(
          API.count_dispositifs({
            theme: theme._id,
            status: "Actif",
            typeContenu: "dispositif"
          }).then((data) => {
            setNbDispositifsByTheme((prev) => ({
              ...prev,
              [theme.name.fr]: data.data
            }));
          }),
          API.count_dispositifs({
            theme: theme._id,
            status: "Actif",
            typeContenu: "demarche"
          }).then((data) => {
            setNbDemarchesByTheme((prev) => ({
              ...prev,
              [theme.name.fr]: data.data
            }));
          })
        );
      }
      Promise.all(promises).finally(() => setLoaded(true));
    }
  }, [loaded, props.visible]);

  const toggleNoGeolocModal = () => setShowNoGeolocModal(!showNoGeolocModal);

  const exportToAirtable = async () => {
    try {
      await API.exportDispositifsGeolocalisation();

      Swal.fire({
        title: "Yay...",
        text: "Export en cours",
        type: "success",
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: "Oh non!",
        text: "Something went wrong",
        type: "error",
        timer: 1500
      });
    }
  };
  const noGeolocFigures = figuresByRegion.filter((data) => data.region === "No geoloc");
  const franceFigures = figuresByRegion.filter((data) => data.region === "France");

  const deactivateNotifications = async () => {
    const res = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: notificationsActive
        ? "Vous allez désactiver les notifications push sur l'application pour une durée indéterminée"
        : "Vous allez réactiver l'envoi de notifications automatiques sur l'application pour une durée indéterminée",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: notificationsActive ? "Oui, désactiver" : "Oui, réactiver",
      cancelButtonText: "Annuler"
    });
    if (!res.value) return;

    return API.setAdminOption(ACTIVES_NOTIFICATIONS, !notificationsActive).then((data) => {
      const res = data.data.data?.value;
      setNotificationsActive(res === null ? true : res);
    });
  };

  return (
    <div className={styles.container + " animated fadeIn"}>
      <div>
        <h2 className="mb-4">Application</h2>
        {notificationsActive === null ? (
          <Spinner size="sm" />
        ) : (
          <FButton type="dark" onClick={deactivateNotifications}>
            {notificationsActive ? "Désactiver les notifications push" : "Réactiver les notifications push"}
          </FButton>
        )}
      </div>

      <div className="unformatted-data mb-10 mt-6">
        <h2 className="mb-4">Statistiques</h2>
        <NavLink to="backend/admin">Admin</NavLink>
        <ul>
          <b>Contenus par thème (nombre de dispositifs/démarches avec thème principal xxx (vs objectif)):</b>
          {Object.keys(nbDispositifsByTheme).map((theme, key) => {
            const targetTheme = find(targetByTag, { name: theme });
            const targetDispo = targetTheme && targetTheme.targetDispositif ? targetTheme.targetDispositif : 0;

            const targetDemarche = targetTheme && targetTheme.targetDemarche ? targetTheme.targetDemarche : 0;
            const currentValueDispositif = nbDispositifsByTheme[theme] ? nbDispositifsByTheme[theme] : 0;

            const currentValueDemarche = nbDemarchesByTheme[theme] ? nbDemarchesByTheme[theme] : 0;
            const colorDispo = currentValueDispositif < targetDispo ? "red" : "green";
            const colorDemarche = currentValueDemarche < targetDemarche ? "red" : "green";
            return (
              <li key={key}>
                {theme} <b style={{ color: colorDispo }}>{currentValueDispositif}</b>
                {""}/{targetDispo} - <b style={{ color: colorDemarche }}>{currentValueDemarche}</b>
                {""}/{targetDemarche}
              </li>
            );
          })}
          <br />
          <b>
            Géolocalisation des dispositifs par région (nombre de dispositifs - nombre de départements avec au moins 1
            dispositif/nombre de départements) :
          </b>
          <FButton type="dark" className="ml-8" onClick={exportToAirtable}>
            Export départements airtable
          </FButton>
          {noGeolocFigures.length > 0 && (
            <li>
              <div
                style={{
                  fontWeight: "bold",
                  color: "red"
                }}
              >
                {`Pas d'infocard geoloc : ${noGeolocFigures[0].nbDispositifs} : `}
                {noGeolocFigures[0].nbDispositifs > 0 && (
                  <FButton type="white" onClick={toggleNoGeolocModal}>
                    Voir les fiches
                  </FButton>
                )}
              </div>
            </li>
          )}
          {franceFigures.length > 0 && <li>{`France entière : ${franceFigures[0].nbDispositifs}`} </li>}
          {figuresByRegion.map((data) => {
            if (data.region === "France" || data.region === "No geoloc") return;
            return (
              <li
                key={data.region}
              >{`${data.region} : ${data.nbDispositifs} - ${data.nbDepartmentsWithDispo}/${data.nbDepartments}`}</li>
            );
          })}
          <br />
          <li>
            Nombre de dispositifs : <b>{nbDispositifs}</b>
          </li>
          <li>
            Nombre de dispositifs actifs : <b>{nbDispositifsActifs}</b>
          </li>
          <li>
            Nombre de démarches : <b>{nbDemarches}</b>
          </li>
          <li>
            Nombre de démarches actives : <b>{nbDemarchesActives}</b>
          </li>
          <li>
            Nombre de contributeurs : <b>{nbContributors}</b>
          </li>
          <li>
            Nombre de traducteurs ou experts : <b>{nbTraductors}</b>
          </li>
          <li>
            Nombre de mercis : <b>{statistics?.nbMercis && formatter.format(statistics.nbMercis)}</b>
          </li>
          <li>
            Nombre de vues : <b>{statistics?.nbVues && formatter.format(statistics.nbVues)}</b>
          </li>
          <li>
            Nombre de vues mobile : <b>{statistics?.nbVuesMobile && formatter.format(statistics.nbVuesMobile)}</b>
          </li>
        </ul>
      </div>
      <NoGeolocModal
        dispositifsWithoutGeoloc={dispositifsWithoutGeoloc}
        show={showNoGeolocModal}
        toggle={toggleNoGeolocModal}
      />
    </div>
  );
};

export default Dashboard;
