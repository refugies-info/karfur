import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { fetchUserActionCreator } from "services/User/user.actions";
import { EditDepartments } from "components/User";

interface Props {}

export const modalDepartments = createModal({
  id: "user-departments-modal",
  isOpenedByDefault: false,
});

export const ModalDepartments = (props: Props) => {
  const dispatch = useDispatch();

  const successCallback = useCallback(() => {
    modalDepartments.close();
    dispatch(fetchUserActionCreator());
  }, [dispatch]);

  return (
    <modalDepartments.Component title="Départements pour la recherche">
      <p className="mb-8">
        Nous vous montrerons uniquement les contenus susceptibles de vous intéresser. Les démarches nationales resteront
        visibles.
      </p>
      <EditDepartments successCallback={successCallback} />
    </modalDepartments.Component>
  );
};
