import { GetWidgetResponse, Id } from "@refugies-info/api-types";
import moment from "moment";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import FButton from "~/components/UI/FButton";
import isInBrowser from "~/lib/isInBrowser";
import { deleteWidgetActionCreator } from "~/services/Widgets/widgets.actions";
import { colors } from "~/utils/colors";
import { copyToClipboard, generateIframe } from "../functions";
import styles from "./WidgetLine.module.scss";

let NotificationManager: any = null;
if (isInBrowser()) {
  const ReactNotifications = require("react-notifications/dist/react-notifications.js");
  NotificationManager = ReactNotifications.NotificationManager;
}

interface Props {
  widget: GetWidgetResponse;
  onClick: (id: Id) => void;
}

export const WidgetLine = (props: Props) => {
  const { widget } = props;
  const dispatch = useDispatch();

  const copyCode = (e: any) => {
    e.stopPropagation();
    const text = generateIframe(widget);
    copyToClipboard(text);
    NotificationManager.success(
      "Le code d'intégration du widget a été copié dans ton presse-papiers.",
      "Copié dans le presse-papiers",
      5000,
    );
  };

  const deleteWidget = (e: any) => {
    e.stopPropagation();

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous supprimer ce widget ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler",
    }).then((res) => {
      if (res.value) {
        dispatch(deleteWidgetActionCreator(widget._id));
      }
    });
  };

  return (
    <div className={styles.container} onClick={() => props.onClick(widget._id)}>
      <div>
        <h3 className={styles.name}>{widget.name}</h3>
        <p className={styles.details}>
          Créé le {moment(widget.created_at).format("LL")} par{" "}
          <span className={styles.author}>{widget.author.username || widget.author.email}</span>
        </p>
      </div>
      <div>
        <FButton name="copy" type="small-figma" className="me-1" theme={colors.gray80} onClick={copyCode}></FButton>
        <FButton name="trash-2-outline" type="small-figma" theme={colors.gray80} onClick={deleteWidget}></FButton>
      </div>
    </div>
  );
};
