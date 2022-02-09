import type { User } from "types/interface";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { assetsOnServer } from "assets/assetsOnServer";
import styles from "./DispositifCard.module.scss";
import Image from "next/image";

const TitleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 16px;
`;
const TitleFramed = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #fbfbfb;
  background: #212121;
  padding: 4px 8px;
  width: ${(props) => props.width};
  margin-top: 4px;
`;
const DescriptionText = styled.div`
  font-size: 18px;
  line-height: 23px;
  margin-top: 16px;
`;
const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  position: absolute;
  bottom: 12px;
`;
interface Props {
  user: User | null;
  toggleModal: any;
}

const DispositifCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className={styles.container}
      onClick={() => {
        if (!props.user) {
          return router.push("/login");
        }
        if (props.user.email !== "") {
          return router.push("/dispositif");
        }
        return props.toggleModal("dispositif");
      }}
    >
      <Image
        src={assetsOnServer.commentContribuer.dispositif}
        alt="dispositif"
        width={200}
        height={162}
      />
      <div className={styles.inner}>
        <div>
          <TitleContainer>
            {t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
          </TitleContainer>
          <TitleFramed width={"113px"}>
            {t("CommentContribuer.Dispositif", "Dispositif")}
          </TitleFramed>
          <DescriptionText>
            {t(
              "CommentContribuer.DispositifDescription",
              `Programme, atelier, formation, cours en ligne, permanence d’accueil ou
      tout autre dispositif directement accessible par les personnes réfugiées.`
            )}
          </DescriptionText>
        </div>
        <TimeContainer>
          <EVAIcon
            name="clock-outline"
            fill="#000000"
            size={10}
            className="mr-10"
          />
          {"~ 20 "}
          {t("CommentContribuer.minutes", "minutes")}
        </TimeContainer>
      </div>
    </div>
  );
};

export default DispositifCard;
