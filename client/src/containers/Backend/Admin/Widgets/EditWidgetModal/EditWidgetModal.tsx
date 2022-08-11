import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { Theme, Widget } from "types/interface";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { saveWidgetActionCreator } from "services/Widgets/widgets.actions";
import FButton from "components/UI/FButton";
import { ThemesInput } from "../components/ThemesInput";
import { LocationInput } from "../components/LocationInput";
import { TypeContenuInput } from "../components/TypeContenuInput";
import { LanguageInput } from "../components/LanguageInput";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { copyToClipboard, generateIframe } from "../functions";
import styles from "./EditWidgetModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  widget: Widget | null;
}

export const EditWidgetModal = (props: Props) => {
  const dispatch = useDispatch();

  const [selectedThemes, setSelectedThemes] = useState<Theme[]>(
    props.widget?.themes || []
  );
  const [selectedTypeContenu, setSelectedTypeContenu] = useState<
    ("demarches" | "dispositifs")[]
  >(props.widget?.typeContenu || ["demarches", "dispositifs"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    props.widget?.languages || []
  );
  const [selectedCity, setSelectedCity] = useState(
    props.widget?.location?.city || ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    props.widget?.location?.department || ""
  );
  const [code, setCode] = useState(props.widget ? generateIframe(props.widget) : "");
  const [copyAndCloseAfterEdit, setCopyAndCloseAfterEdit] = useState(false);

  useEffect(() => {
    if (props.widget) {
      setSelectedThemes(props.widget.themes);
      setSelectedTypeContenu(props.widget.typeContenu);
      setSelectedLanguages(props.widget.languages || []);
      setSelectedCity(props.widget?.location?.city || "");
      setSelectedDepartment(props.widget?.location?.department || "");
    } else {
      setSelectedThemes([]);
      setSelectedTypeContenu([]);
      setSelectedLanguages([]);
      setSelectedCity("");
      setSelectedDepartment("");
    }
  }, [props.widget]);

  const editWidget = (e: any) => {
    e.preventDefault();
    dispatch(saveWidgetActionCreator({
      _id: props.widget?._id,
      themes: selectedThemes,
      typeContenu: selectedTypeContenu,
      languages: selectedLanguages,
      location: {
        city: selectedCity,
        department: selectedDepartment,
      }
    }));
  }

  const editAndCopy = (e: any) => {
    setCopyAndCloseAfterEdit(true);
    editWidget(e);
  }

  useEffect(() => {
    if (props.widget) {
      const generatedCode = generateIframe(props.widget);
      setCode(generatedCode)

      if (copyAndCloseAfterEdit) {
        copyToClipboard(generatedCode);
        props.toggle();
        setCopyAndCloseAfterEdit(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.widget]);

  const languages = useSelector(allLanguesSelector);

  const canSubmit = selectedTypeContenu.length > 0 && selectedThemes.length > 0;

  return (
    <DetailsModal
      show={props.show}
      toggleModal={props.toggle}
      leftHead={null}
      rightHead={null}
      isLoading={!props.widget}
      contentClassName={styles.modal_content}
    >
      <h3>{props.widget?.name || ""}</h3>
      <Row>
        <Col sm="6">
          <form>
            <ThemesInput
              selectedThemes={selectedThemes}
              //@ts-ignore
              setSelectedThemes={setSelectedThemes}
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
              languages={languages.filter(ln => ln.i18nCode !== "fr")}
            />
          </form>
        </Col>

        <Col sm="6">
          <div className={styles.code_container}>
            <h4 className={styles.code_title}>Code d’intégration</h4>
            <pre className={styles.code}>{code}</pre>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={{ offset: 6, size: 6 }}>
          <div className={styles.buttons}>
            <FButton type="white" name="close-outline" onClick={props.toggle}>
              Annuler
            </FButton>
            <div>
              <FButton type="dark" name="save-outline" disabled={!canSubmit} onClick={editWidget} className="mr-2">
                Sauvegarder
              </FButton>
              <FButton type="validate" name="copy-outline" disabled={!canSubmit} onClick={editAndCopy}>
                Sauvegarder et copier
              </FButton>
            </div>
          </div>
        </Col>
      </Row>
    </DetailsModal>
  );
};
