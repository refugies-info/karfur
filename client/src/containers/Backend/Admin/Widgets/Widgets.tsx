import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ObjectId } from "mongodb";
import { Widget } from "types/interface";
import isInBrowser from "lib/isInBrowser";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { widgetsSelector } from "services/Widgets/widgets.selectors";
import FButton from "components/UI/FButton";
import FInput from "components/UI/FInput/FInput";
import {
  createWidgetActionCreator,
  fetchWidgetsActionCreator,
} from "services/Widgets/widgets.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { FigureContainer } from "../sharedComponents/StyledAdmin";
import { WidgetLine } from "./components/WidgetLine";
import { ThemesInput } from "./components/ThemesInput";
import { LocationInput } from "./components/LocationInput";
import { TypeContenuInput } from "./components/TypeContenuInput";
import { LanguageInput } from "./components/LanguageInput";
import { EditWidgetModal } from "./EditWidgetModal/EditWidgetModal";
import styles from "./Widgets.module.scss";

let NotificationContainer: any = null;
if (isInBrowser()) {
  const ReactNotifications = require("react-notifications/dist/react-notifications.js");
  NotificationContainer = ReactNotifications.NotificationContainer;
}


export const Widgets = () => {
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypeContenu, setSelectedTypeContenu] = useState<
    ("demarche" | "dispositif")[]
  >(["demarche", "dispositif"]);
  const [selectedLanguages, setSelectedLanguages] = useState<ObjectId[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const dispatch = useDispatch();

  const isFetching = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_WIDGETS)
  );
  const isSaving = useSelector(isLoadingSelector(LoadingStatusKey.SAVE_WIDGET));
  const widgets = useSelector(widgetsSelector);
  const languages = useSelector(allLanguesSelector);

  useEffect(() => {
    dispatch(fetchWidgetsActionCreator());
  }, [dispatch]);

  const resetForm = useCallback(() => {
    setName("");
    setSelectedTags([]);
    setSelectedTypeContenu(["demarche", "dispositif"]);
    setSelectedLanguages([]);
    setSelectedCity("");
  }, []);

  const createWidget = (e: any) => {
    e.preventDefault();
    dispatch(
      createWidgetActionCreator({
        name: name,
        tags: selectedTags,
        typeContenu: selectedTypeContenu,
        languages: selectedLanguages,
        location: {
          city: selectedCity,
          department: selectedDepartment,
        },
      })
    );
    resetForm();
  };

  const toggleModal = (widgetId: ObjectId | null) => {
    if (!widgetId) {
      setSelectedWidget(null);
      setShowEditModal(false);
    } else {
      const widget = widgets.find(w => w._id === widgetId);
      if (widget) {
        setSelectedWidget(widget);
        setShowEditModal(true);
      }
    }
  }

  const canSubmit = !!name && selectedTypeContenu.length > 0 && selectedTags.length > 0;

  return (
    <div className="m-5">
      <h2 className={styles.title}>
        Widgets
        <FigureContainer>{widgets.length}</FigureContainer>
      </h2>
      <Row>
        <Col>
          <form className={styles.form}>
            <FInput
              id="value"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              placeholder="Choisis un titre"
            />

            <ThemesInput
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />

            <LocationInput
              selectedCity={selectedCity}
              selectedDepartment={selectedDepartment}
              setSelectedCity={setSelectedCity}
              setSelectedDepartment={setSelectedDepartment}
            />

            <TypeContenuInput
              selectedTypeContenu={selectedTypeContenu}
              setSelectedTypeContenu={setSelectedTypeContenu}
            />

            <LanguageInput
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              languages={languages}
            />

            <div className={styles.buttons}>
              <FButton
                type="white"
                onClick={(e: any) => {
                  e.preventDefault();
                  resetForm();
                }}
                name="trash-2-outline"
              >
                Tout effacer
              </FButton>
              <FButton
                type="validate"
                onClick={createWidget}
                name="plus-circle-outline"
                disabled={isSaving || !canSubmit}
              >
                Créer le widget
              </FButton>
            </div>
          </form>
        </Col>
        <Col>
          {isFetching ?
            <SkeletonTheme color="#CDCDCD">
              <Skeleton
                width="100%"
                height={72}
                count={3}
                className="mb-4"
                style={{borderRadius: 12}}
              />
            </SkeletonTheme> :
            (widgets || []).map((widget) => (
              <WidgetLine
                key={widget._id.toString()}
                widget={widget}
                onClick={toggleModal}
              />
            ))}
        </Col>
      </Row>

      <EditWidgetModal
        show={showEditModal}
        toggle={() => toggleModal(null)}
        widget={selectedWidget}
      />

      {isInBrowser() && NotificationContainer !== null &&
        <NotificationContainer />
      }
    </div>
  );
};
