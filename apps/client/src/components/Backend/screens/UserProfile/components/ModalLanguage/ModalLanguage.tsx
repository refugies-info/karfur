import { EditLanguage } from "@/components/User";
import { fetchUserActionCreator } from "@/services/User/user.actions";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

interface Props {}

export const modalLanguage = createModal({
  id: "user-language-modal",
  isOpenedByDefault: false,
});

export const ModalLanguage = (props: Props) => {
  const dispatch = useDispatch();

  const successCallback = useCallback(() => {
    modalLanguage.close();
    dispatch(fetchUserActionCreator());
  }, [dispatch]);

  return (
    <modalLanguage.Component title={<div className="mb-6">Langues de traduction</div>}>
      <EditLanguage successCallback={successCallback} buttonType="validate" />
    </modalLanguage.Component>
  );
};
