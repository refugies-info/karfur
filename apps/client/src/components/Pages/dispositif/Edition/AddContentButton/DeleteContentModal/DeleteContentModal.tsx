import BaseModal from "@/components/UI/BaseModal";
import Button from "@/components/UI/Button";

interface Props {
  show: boolean;
  toggle: () => void;
  onValidate: () => void;
}

const DeleteContentModal = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} title="Êtes-vous sûr de vouloir supprimer cet élément ?" small>
      <div>
        <p>Si vous le supprimez, le contenu sera perdu.</p>

        <div className="text-end">
          <Button
            priority="secondary"
            onClick={(e: any) => {
              e.preventDefault();
              props.toggle();
            }}
            evaIcon="close-outline"
            iconPosition="right"
            className="me-2"
          >
            Annuler
          </Button>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              props.onValidate();
            }}
            evaIcon="trash-2-outline"
            iconPosition="right"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteContentModal;
