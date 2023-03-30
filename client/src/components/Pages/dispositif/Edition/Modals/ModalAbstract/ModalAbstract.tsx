import React, { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { ContentType, CreateDispositifRequest } from "api-types";
import { themesSelector } from "services/Themes/themes.selectors";
import DispositifCard from "components/UI/DispositifCard";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { BaseModal } from "components/Pages/dispositif";
import { SimpleFooter } from "../components";
import { getDefaultDispositif } from "./functions";
import { help } from "./data";
import styles from "./ModalAbstract.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_LENGTH = 110;

const ModalAbstract = (props: Props) => {
  const formContext = useFormContext<CreateDispositifRequest>();
  const values = useWatch<CreateDispositifRequest>();
  const themes = useSelector(themesSelector);
  const [abstract, setAbstract] = useState<string | undefined>(values.abstract);

  const validate = () => {
    formContext.setValue("abstract", abstract || "");
    props.toggle();
  };

  const remainingChars = useMemo(() => MAX_LENGTH - (abstract || "").length, [abstract]);

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajoutez un résumé">
      <div>
        <Row>
          <Col>
            <div className={styles.text}>
              <textarea
                onChange={(e: any) => setAbstract(e.target.value)}
                placeholder="Résumez en 1 phrase votre action"
                value={abstract}
                className={styles.input}
                maxLength={MAX_LENGTH}
              />

              <p className={styles.help}>
                <EVAIcon name="alert-triangle" size={16} fill={styles.lightTextDefaultError} className="me-2" />
                {remainingChars} sur 110 caractères restants
              </p>
            </div>
          </Col>
          {values.typeContenu === ContentType.DISPOSITIF && (
            <>
              <Col xs="auto" className="px-0 d-flex align-items-center">
                <EVAIcon name="arrow-forward-outline" size={32} fill={styles.lightTextActionHighBlueFrance} />
              </Col>
              <Col>
                <DispositifCard
                  dispositif={{ ...getDefaultDispositif(values, themes[0]._id), abstract }}
                  abstractPlaceholder
                />
              </Col>
            </>
          )}
        </Row>

        <SimpleFooter onValidate={validate} disabled={!abstract} />
      </div>
    </BaseModal>
  );
};

export default ModalAbstract;
