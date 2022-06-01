import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { ObjectId } from "mongodb";
import { Widget } from "types/interface";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import FButton from "components/UI/FButton";
import { ThemesInput } from "../components/ThemesInput";
import { LocationInput } from "../components/LocationInput";
import { TypeContenuInput } from "../components/TypeContenuInput";
import { LanguageInput } from "../components/LanguageInput";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { generateIframe } from "../functions";
import styles from "./EditWidgetModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  widget: Widget | null;
}

export const EditWidgetModal = (props: Props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    props.widget?.tags || []
  );
  const [selectedTypeContenu, setSelectedTypeContenu] = useState<
    ("demarche" | "dispositif")[]
  >(props.widget?.typeContenu || ["demarche", "dispositif"]);
  const [selectedLanguages, setSelectedLanguages] = useState<ObjectId[]>(
    props.widget?.languages || []
  );
  const [selectedCity, setSelectedCity] = useState(
    props.widget?.location?.city || ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    props.widget?.location?.department || ""
  );

  useEffect(() => {
    if (props.widget) {
      setSelectedTags(props.widget.tags);
      setSelectedTypeContenu(props.widget.typeContenu);
      setSelectedLanguages(props.widget.languages || []);
      setSelectedCity(props.widget?.location?.city || "");
      setSelectedDepartment(props.widget?.location?.department || "");
    } else {
      setSelectedTags([]);
      setSelectedTypeContenu([]);
      setSelectedLanguages([]);
      setSelectedCity("");
      setSelectedDepartment("");
    }
  }, [props.widget]);

  const languages = useSelector(allLanguesSelector);

  const canSubmit = selectedTypeContenu.length > 0 && selectedTags.length > 0;

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
          </form>
        </Col>

        <Col sm="6">
          <div className={styles.code_container}>
            <h4 className={styles.code_title}>Code d’intégration</h4>
            <pre className={styles.code}>
              {props.widget ? generateIframe(props.widget) : ""}
            </pre>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={{ offset: 6, size: 6 }}>
          <div className={styles.buttons}>
            <FButton type="white" name="close-outline" onClick={props.toggle}>
              Annuler
            </FButton>
            <FButton type="dark" name="save-outline" disabled={!canSubmit}>
              Sauvegarder
            </FButton>
            <FButton type="validate" name="copy-outline" disabled={!canSubmit}>
              Sauvegarder et copier
            </FButton>
          </div>
        </Col>
      </Row>
    </DetailsModal>
  );
};
