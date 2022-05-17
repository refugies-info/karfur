import { Input } from "reactstrap";
import FButton from "components/UI/FButton";
import styles from "./NotesInput.module.scss";

interface Props {
  adminComments: string;
  onNotesChange: (e: any) => void;
  saveAdminComments: () => void;
  adminCommentsSaved: boolean;
  oldComments: string;
}

export const NotesInput = (props: Props) => {
  const getButtonColor = () => {
    if (props.adminCommentsSaved) return "saved";
    if (props.oldComments !== props.adminComments) return "modified";
    return "dark";
  };

  return (
    <>
      <Input
        type="textarea"
        placeholder="Note sur la fiche ..."
        rows={5}
        maxLength={3000}
        value={props.adminComments}
        onChange={props.onNotesChange}
        id="note"
        className={styles.input}
      />
      <FButton
        name="save-outline"
        type={getButtonColor()}
        onClick={props.saveAdminComments}
        className="mt-1 w-100"
      >
        {!props.adminCommentsSaved ? "Enregistrer" : "Enregistré !"}
      </FButton>
    </>
  );
};
