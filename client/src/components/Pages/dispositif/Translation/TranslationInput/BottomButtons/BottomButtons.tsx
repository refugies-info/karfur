import { useEvent } from "hooks";
import Button from "components/UI/Button";
import styles from "./BottomButtons.module.scss";

interface Props {
  cancel: () => void;
  saveTrad: (unfinished: boolean) => void;
  disabled: boolean;
}

const BottomButtons = ({ cancel, saveTrad, disabled }: Props) => {
  const { Event } = useEvent();

  return (
    <div className={styles.buttons}>
      <Button priority="secondary" onClick={cancel} evaIcon="close-outline" iconPosition="right">
        Annuler
      </Button>
      <div className="text-end">
        <Button
          disabled={disabled}
          priority="secondary"
          onClick={() => {
            saveTrad(true);
            Event("DISPO_TRAD", "finish later", "Translation Input");
          }}
          evaIcon="clock-outline"
          iconPosition="right"
          className="me-4"
        >
          Finir plus tard
        </Button>
        <Button disabled={disabled} onClick={() => saveTrad(false)} evaIcon="checkmark-circle-2" iconPosition="right">
          Valider
        </Button>
      </div>
    </div>
  );
};

export default BottomButtons;
