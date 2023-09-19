import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { rendez_vous_ordinateur } from "assets/figma";
import { FButtonMobile } from "components/UI/FButtonMobile/FButtonMobile";
import { colors } from "colors";
import Image from "next/image";
import styles from "scss/components/modals.module.scss";
import { useTranslation } from "next-i18next";

interface Props {
  toggle: () => void;
  show: boolean;
  toggleShowInvitationEmailModal: () => void;
}

const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin: 8px;
`;
const MainContainer = styled.div`
  text-align: center;
  padding: 29px;
  padding-top: 50px;
  margin: 8px;
`;
const TextContainer = styled.div`
  font-size: 18px;
  font-weight: normal;
  margin: 16px;
`;
const ButtonContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const GoToDesktopModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <MainContainer>
        <Image src={rendez_vous_ordinateur} alt="image newsletter" style={{ maxWidth: "100%", height: "auto" }} />
        <TitleContainer>
          {t("Register.Rendez-vous sur votre ordinateur", "Rendez-vous sur votre ordinateur")}
        </TitleContainer>
        <TextContainer>
          {t("Register.create_a_new_account", "Créez-vous un compte depuis votre ordinateur pour participer")}
        </TextContainer>
        <ButtonContainer>
          <FButtonMobile
            name="email-outline"
            isDisabled={false}
            fill="white"
            color={colors.gray90}
            onClick={props.toggleShowInvitationEmailModal}
            i18nKey="Register.email_reminder"
            defaultTitle="Me le rappeler par email"
          />
        </ButtonContainer>
        <ButtonContainer>
          <FButtonMobile
            name="checkmark-outline"
            isDisabled={false}
            fill="white"
            color={colors.vert}
            onClick={props.toggle}
            i18nKey="Dispositif.compris"
            defaultTitle="Ok, compris !"
          />
        </ButtonContainer>
      </MainContainer>
    </Modal>
  );
};
