import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ModalBody, ModalFooter } from "reactstrap";
import { getPath } from "routes";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import WriteContentCard from "components/Pages/staticPages/publier/WriteContentCard";
import { assetsOnServer } from "assets/assetsOnServer";
import Modal from "../Modal";
import styles from "./WriteContentModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const WriteContentModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<"dispositif" | "demarche" | null>(null);

  const navigate = () => {
    const path = selected === "dispositif" ? "/dispositif" : "/demarche";
    router.push(getPath(path, router.locale));
  };

  return (
    <Modal show={props.show} toggle={props.toggle} className={styles.modal}>
      <ModalBody>
        <button className={styles.close} onClick={props.toggle}>
          <EVAIcon name="close-outline" fill="dark" size={24} className="mr-10" />
        </button>
        <div className={styles.cards}>
          <WriteContentCard
            onSelect={() => setSelected("dispositif")}
            color="orange"
            imageSrc={assetsOnServer.publier.dispositif}
            type={t("Publish.writeModalTypeDispositif")}
            description={t("Publish.writeModalDescDispositif")}
            duration={"20"}
            selected={selected === "dispositif"}
          />
          <WriteContentCard
            onSelect={() => setSelected("demarche")}
            color="red"
            imageSrc={assetsOnServer.publier.demarche}
            type={t("Publish.writeModalTypeDemarche")}
            description={t("Publish.writeModalDescDemarche")}
            duration={"40"}
            selected={selected === "demarche"}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <FButton type="validate" disabled={selected === null} onClick={navigate}>
          Confirmer
          <EVAIcon name="arrow-forward-outline" fill="white" size={20} className="ml-10" />
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default WriteContentModal;
