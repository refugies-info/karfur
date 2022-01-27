import type { User } from "types/interface";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { assetsOnServer } from "assets/assetsOnServer";
import styles from "./DemarcheCard.module.scss";

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
const DemarcheCardContainer = styled.div``;
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

const DemarcheCard = (props: Props) => {
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
          return router.push("/demarche");
        }
        return props.toggleModal("demarche");
      }}
    >
      <Image
        src={assetsOnServer.commentContribuer.demarche}
        width={200}
        height={162}
        alt="demarche"
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <TitleContainer>
            {t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
          </TitleContainer>
          <TitleFramed width={"122px"}>
            {t("CommentContribuer.Démarche", "Démarche")}
          </TitleFramed>
          <DescriptionText>
            {t(
              "CommentContribuer.DemarcheDescription",
              "Expliquez une démarche administrative étape par étape pour faciliter son accès et sa compréhension par les personnes réfugiées."
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
          {"~ 40 "}
          {t("CommentContribuer.minutes", "minutes")}
        </TimeContainer>
      </div>
    </div>
  );
};
export default DemarcheCard;
