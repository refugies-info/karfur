import { fr } from "@codegouvfr/react-dsfr";
import { CreateDispositifRequest } from "@refugies-info/api-types";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ArrowRight from "~/assets/dispositif/arrow-right.svg";
import BaseModal from "~/components/UI/BaseModal";
import DispositifCard from "~/components/UI/DispositifCard";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { useContentType } from "~/hooks/dispositif";
import { SimpleFooter } from "../components";
import { help } from "./data";
import { getDefaultDispositif } from "./functions";
import styles from "./ModalAbstract.module.scss";
import { useSponsorData } from "./useSponsorData";

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
  const sponsor = useSponsorData(values, typeContenu);

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajoutez un résumé">
      <div>
        <p>Le résumé doit faire moins de 110 caractères.</p>
        <div className="d-flex">
          <div>
            <div className={styles.text}>
              <textarea
                onChange={(e: any) => setAbstract(e.target.value)}
                placeholder="Résumez votre action en quelques mots"
                value={abstract}
                className={styles.input}
                maxLength={MAX_LENGTH}
              />

              <p className={styles.help}>
                <EVAIcon
                  name="alert-triangle"
                  size={16}
                  fill={fr.colors.decisions.background.actionHigh.error.default}
                  className="me-2"
                />
                {remainingChars} sur 110 caractères restants
              </p>
            </div>
          </div>
          <div>
            <span className={styles.arrow}>
              <Image src={ArrowRight} width={60} height={29} alt="" />
            </span>
          </div>

          <div className={styles.card}>
            <DispositifCard dispositif={{ ...getDefaultDispositif(values, sponsor), abstract }} demoCard />
          </div>
        </div>

        <SimpleFooter onValidate={validate} disabled={!abstract} />
      </div>
    </BaseModal>
  );
};

export default ModalAbstract;
