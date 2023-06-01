import { useCallback } from "react";
import { BaseModal } from "components/Pages/dispositif";
import Button from "components/UI/Button";

interface Props {
  show: boolean;
}

const SaveErrorModal = (props: Props) => {
  const reload = useCallback(() => location.reload(), []);

  return (
    <BaseModal show={props.show} title={"Erreur lors de la sauvegarde"} small>
      <p>Erreur lors de la sauvegarde, veuillez recharger la page</p>
      <div className="text-end">
        <Button onClick={reload}>Recharger la page</Button>
      </div>
    </BaseModal>
  );
};

export default SaveErrorModal;
