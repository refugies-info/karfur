import React, { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Image from "next/image";
import { Col, Row } from "reactstrap";
import { ContentType, CreateDispositifRequest } from "@refugies-info/api-types";
import { useContentType } from "hooks/dispositif";
import DispositifCard from "components/UI/DispositifCard";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BaseModal from "components/UI/BaseModal";
import { SimpleFooter } from "../components";
import { getDefaultDispositif } from "./functions";
import { help } from "./data";
import ArrowRight from "assets/dispositif/arrow-right.svg";
import styles from "./ModalAbstract.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_LENGTH = 110;

const ModalAbstract = (props: Props) => {
  const formContext = useFormContext<CreateDispositifRequest>();
  const values = useWatch<CreateDispositifRequest>();
  const [abstract, setAbstract] = useState<string | undefined>(values.abstract);
  const typeContenu = useContentType();

  const validate = () => {
    formContext.setValue("abstract", abstract || "");
    props.toggle();
  };

  const remainingChars = useMemo(() => MAX_LENGTH - (abstract || "").length, [abstract]);

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajoutez un résumé">
      <div>
        <p>Le résumé doit faire moins de 110 caractères.</p>
        <Row className="position-relative">
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
          {typeContenu === ContentType.DISPOSITIF && (
            <>
              <span className={styles.arrow}>
                <Image src={ArrowRight} width={60} height={29} alt="" />
              </span>
              <Col>
                <DispositifCard dispositif={{ ...getDefaultDispositif(values), abstract }} demoCard />
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
