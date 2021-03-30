import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Col,
  Input,
  Label,
  ModalFooter,
} from "reactstrap";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { useSelector, useDispatch } from "react-redux";
import { allLanguesSelector } from "../../../../services/Langue/langue.selectors";
import { userSelector } from "../../../../services/User/user.selectors";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { Language, UserLanguage } from "../../../../types/interface";
import "./TranslationLanguagesChoiceModal.scss";
import { saveUserActionCreator } from "../../../../services/User/user.actions";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

interface Props extends RouteComponentProps {
  show: boolean;
  toggle: () => void;
}

const TranslationLanguagesChoiceModalComponent = (props: Props) => {
  const [selectedLangues, setSelectedLangues] = useState<UserLanguage[]>([]);

  const langues = useSelector(allLanguesSelector);
  const user = useSelector(userSelector);
  const isLoadingLangues = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_LANGUES)
  );
  const isLoadingUser = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER)
  );

  const isLoading = isLoadingLangues || isLoadingUser;

  useEffect(() => {
    if (
      user &&
      user.user &&
      user.user.selectedLanguages &&
      user.user.selectedLanguages.length > 0
    ) {
      setSelectedLangues(user.user.selectedLanguages);
    }
  }, [isLoading, user]);

  if (isLoading)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="modal-traducteur"
      >
        <ModalHeader toggle={props.toggle}>C'est parti !</ModalHeader>
        <ModalBody>
          <h5>Quelles sont vos langues de travail ?</h5>
          <Skeleton count={3} />
        </ModalBody>
        <ModalFooter>
          <FButton type="validate" name="checkmark-outline" disabled={true}>
            Valider
          </FButton>
        </ModalFooter>
      </Modal>
    );
  const handleCheck = (langue: Language) => {
    const isLangueSelected = !!selectedLangues.find(
      (selectedLangue) => selectedLangue._id === langue._id
    );

    if (isLangueSelected) {
      return setSelectedLangues(
        selectedLangues.filter(
          (selectedLangue) => selectedLangue._id !== langue._id
        )
      );
    }

    if (!isLangueSelected) {
      const newSelectedLangues = selectedLangues.concat({
        _id: langue._id,
        i18nCode: langue.i18nCode,
        langueCode: langue.langueCode,
        langueFr: langue.langueFr,
        langueLoc: langue.langueLoc,
      });
      setSelectedLangues(newSelectedLangues);
    }
  };

  const dispatch = useDispatch();

  const onValidate = () => {
    if (!user || !user.user) return;
    dispatch(
      saveUserActionCreator({
        user: {
          selectedLanguages: selectedLangues,
          _id: user.user._id,
        },
        type: "modify-my-details",
      })
    );

    props.toggle();
    return props.history.push(
      "/backend/user-translation/" + selectedLangues[0].i18nCode
    );
  };
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-traducteur"
    >
      <ModalHeader toggle={props.toggle}>C'est parti !</ModalHeader>
      <ModalBody>
        <h5>Quelles sont vos langues de travail ?</h5>
        <FormGroup row>
          {(langues || [])
            .filter(
              // @ts-ignore
              (langue) => langue.avancement > 0.8 && langue.i18nCode !== "fr"
            )
            .map((langue, key) => {
              const isLangueChecked = !!selectedLangues.find(
                (selectedLangue) => selectedLangue._id === langue._id
              );
              return (
                <Col lg="3" key={key}>
                  <FormGroup check>
                    <Input
                      className="form-check-input langue"
                      type="checkbox"
                      // @ts-ignore
                      id={langue._id}
                      checked={isLangueChecked}
                      onChange={() => handleCheck(langue)}
                    />
                    <Label
                      check
                      className="form-check-label"
                      // @ts-ignore
                      htmlFor={langue._id}
                    >
                      {langue.langueFr}
                    </Label>
                  </FormGroup>
                </Col>
              );
            })}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <FButton
          type="validate"
          name="checkmark-outline"
          disabled={selectedLangues.length === 0}
          onClick={onValidate}
        >
          Valider
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export const TranslationLanguagesChoiceModal = withRouter(
  TranslationLanguagesChoiceModalComponent
);
