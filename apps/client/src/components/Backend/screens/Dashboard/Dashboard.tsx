import { ContentType, GetRegionStatisticsResponse, GetStatisticsResponse, Id } from "@refugies-info/api-types";
import find from "lodash/find";
import moment from "moment";
import "moment/locale/fr";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";
import FButton from "~/components/UI/FButton/FButton";
import { handleApiError } from "~/lib/handleApiErrors";
import { themesSelector } from "~/services/Themes/themes.selectors";
import API from "~/utils/API";
import { colors } from "~/utils/colors";
import styles from "./Dashboard.module.scss";
import { targetByTag } from "./data";
import { NoGeolocModal } from "./NoGeolocModal";

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
  const [figuresByRegion, setFiguresByRegion] = useState<GetRegionStatisticsResponse["regionFigures"]>([]);
  const [showNoGeolocModal, setShowNoGeolocModal] = useState(false);
  const [dispositifsWithoutGeoloc, setDispositifsWithoutGeoloc] = useState<Id[]>([]);
  const [statistics, setStatistics] = useState<GetStatisticsResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState<boolean | null>(null);
  const themes = useSelector(themesSelector);

  useEffect(() => {
    if (props.visible && !loaded) {
      const promises = [
        API.countDispositifs({
          type: ContentType.DISPOSITIF,
          publishedOnly: false,
        }).then((data) => setNbDispositifs(data.count)),
        API.countDispositifs({
          type: ContentType.DISPOSITIF,
          publishedOnly: true,
        }).then((data) => setNbDispositifsActifs(data.count)),
        API.countDispositifs({
          type: ContentType.DEMARCHE,
          publishedOnly: false,
        }).then((data) => setNbDemarches(data.count)),
        API.countDispositifs({
          type: ContentType.DEMARCHE,
          publishedOnly: true,
        }).then((data) => setNbDemarchesActives(data.count)),
        API.getUsersStatistics().then((data) => {
          setNbContributors(data.nbContributors);
          setNbTraductors(data.nbTraductors);
        }),
        API.getNbDispositifsByRegion().then((data) => {
          setFiguresByRegion(data.regionFigures);
          setDispositifsWithoutGeoloc(data.dispositifsWithoutGeoloc);
        }),
        API.getDispositifsStatistics({ facets: ["nbMercis", "nbVues", "nbVuesMobile"] }).then((data) => {
          setStatistics(data);
        }),
        API.getAdminOption(ACTIVES_NOTIFICATIONS).then((data) => {
          const res = data?.value as boolean;
          setNotificationsActive(res === null ? true : res);
        }),
      ];

      for (const theme of themes) {
        promises.push(
          API.countDispositifs({
            themeId: theme._id.toString(),
            publishedOnly: true,
            type: ContentType.DISPOSITIF,
          }).then((data) => {
            setNbDispositifsByTheme((prev) => ({
              ...prev,
              [theme.name.fr]: data.count,
            }));
          }),
          API.countDispositifs({
            themeId: theme._id.toString(),
            publishedOnly: true,
            type: ContentType.DEMARCHE,
          }).then((data) => {
            setNbDemarchesByTheme((prev) => ({
              ...prev,
              [theme.name.fr]: data.count,
            }));
          }),
        );
      }
      Promise.all(promises).finally(() => setLoaded(true));
    }
  }, [loaded, props.visible, themes]);

  const toggleNoGeolocModal = () => setShowNoGeolocModal(!showNoGeolocModal);

  const exportToAirtable = async () => {
    try {
      await API.exportDispositifsGeolocalisation();

      Swal.fire({
        title: "Yay...",
        text: "Export en cours",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      handleApiError({ text: "Something went wrong" });
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
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: notificationsActive ? "Oui, désactiver" : "Oui, réactiver",
      cancelButtonText: "Annuler",
    });
    if (!res.value) return;

    return API.setAdminOption(ACTIVES_NOTIFICATIONS, { value: !notificationsActive }).then((data) => {
      const res = data?.value as boolean;
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

      <div className="unformatted-data mb-2 mt-6">
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
          <FButton type="dark" className="ms-2" onClick={exportToAirtable}>
            Export départements airtable
          </FButton>
          {noGeolocFigures.length > 0 && (
            <li>
              <div
                style={{
                  fontWeight: "bold",
                  color: "red",
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
