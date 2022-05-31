import { colors } from "colors";
import FButton from "components/UI/FButton";
import moment from "moment";
import { Widget } from "types/interface";
import styles from "./WidgetLine.module.scss";

interface Props {
  widget: Widget;
}

export const WidgetLine = (props: Props) => {
  const { widget } = props;
  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.name}>{widget.name}</h3>
        <p className={styles.details}>
          Créé le {moment(widget.created_at).format("LL")} par{" "}
          <span className={styles.author}>{widget.author.username}</span>
        </p>
      </div>
      <div>
        <FButton
          name="copy"
          type="small-figma"
          className="mr-1"
          theme={colors.gray80}
        ></FButton>
        <FButton
          name="trash-2-outline"
          type="small-figma"
          theme={colors.gray80}
        ></FButton>
      </div>
    </div>
  );
};
