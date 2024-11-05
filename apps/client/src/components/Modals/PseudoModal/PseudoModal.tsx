import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { EditPseudo } from "~/components/User";
import { fetchUserActionCreator } from "~/services/User/user.actions";

interface Props {
  successCallback: () => void;
}

export const pseudoModal = createModal({
  id: "user-pseudo-modal",
  isOpenedByDefault: false,
});

export const PseudoModal = ({ successCallback }: Props) => {
  const dispatch = useDispatch();

  const onSuccess = useCallback(() => {
    dispatch(fetchUserActionCreator());
    pseudoModal.close();
    successCallback();
  }, [dispatch, successCallback]);

  return (
    <pseudoModal.Component title="Choisissez un pseudonyme">
      <p>Au pied de chaque fiche, nous affichons les contributeurs ayant participé à sa rédaction et sa traduction.</p>
      <EditPseudo successCallback={onSuccess} />
    </pseudoModal.Component>
  );
};
