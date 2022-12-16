import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ModalBody, ModalFooter } from "reactstrap";
import { getPath } from "routes";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import WriteContentCard from "components/Pages/staticPages/publier/WriteContentCard";
import { assetsOnServer } from "assets/assetsOnServer";
import { userSelector } from "services/User/user.selectors";
import Modal from "../Modal";
import { CompleteProfilModal } from "../CompleteProfilModal/CompleteProfilModal";
import styles from "./WriteContentModal.module.scss";

interface Props {
  show: boolean;
  close: () => void;
}

const WriteContentModal = ({ show, close }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector(userSelector);

  const [selected, setSelected] = useState<"dispositif" | "demarche" | null>(null);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);

  useEffect(() => {
    if (show) {
      const hasEmail = user.user && user.user.email;
      if (hasEmail) {
        setShowWriteModal(true);
      } else {
        setShowCompleteProfilModal(true);
      }
    }
  }, [show, user.user]);

  useEffect(() => {
    if (show && !showWriteModal && !showCompleteProfilModal) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWriteModal, showCompleteProfilModal, close]);

  const navigate = () => {
    const path = selected === "dispositif" ? "/dispositif" : "/demarche";
    router.push(getPath(path, router.locale));
  };

  return (
    <>
      <CompleteProfilModal
        show={showCompleteProfilModal}
        toggle={() => setShowCompleteProfilModal((o) => !o)}
        user={user.user}
        onComplete={() => {
          setShowWriteModal(true);
          setShowCompleteProfilModal(false);
        }}
      />

      <Modal show={showWriteModal} toggle={() => setShowWriteModal((o) => !o)} className={styles.modal}>
        <ModalBody>
          <button className={styles.close} onClick={() => setShowWriteModal(false)}>
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
    </>
  );
};

export default WriteContentModal;
