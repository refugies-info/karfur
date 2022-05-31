import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ObjectId } from "mongodb";
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
import styles from "./Widgets.module.scss";
import { WidgetLine } from "./components/WidgetLine";
import { ThemesInput } from "./components/ThemesInput";
import { LocationInput } from "./components/LocationInput";
import { TypeContenuInput } from "./components/TypeContenuInput";
import { LanguageInput } from "./components/LanguageInput";

export const Widgets = () => {
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypeContenu, setSelectedTypeContenu] = useState<
    ("demarche" | "dispositif")[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<ObjectId[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
    setSelectedTypeContenu([]);
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

  return (
    <div className="m-5">
      <h2 className={styles.title}>Widgets</h2>
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
                disabled={isSaving}
              >
                Créer le widget
              </FButton>
            </div>
          </form>
        </Col>
        <Col>
          {!isFetching &&
            widgets.length > 0 &&
            widgets.map((widget) => (
              <WidgetLine key={widget._id.toString()} widget={widget} />
            ))}
        </Col>
      </Row>
    </div>
  );
};
