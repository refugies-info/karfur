import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { assetsOnServer } from "assets/assetsOnServer";
import styles from "./StructureCard.module.scss";
import Image from "next/legacy/image";

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
  width: ${(props: {width: string}) => props.width};
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


const StructureCard = () => {
  const { t } = useTranslation();

return (
  <div className={styles.container}>
    <Image
    src={assetsOnServer.commentContribuer.structure}
      alt="structure"
      width={200}
        height={162}
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
          {t("CommentContribuer.Recenser", "Recenser une")}
        </TitleContainer>
        <TitleFramed width={"148px"}>
          {t("CommentContribuer.Organisation", "Organisation")}
        </TitleFramed>
        <DescriptionText>
          {t(
            "CommentContribuer.StructureDescription",
            "Complétez l’annuaire de l’intégration pour faciliter la prise de contact entre acteurs et l’accès aux interlocuteurs pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="sun-outline"
          fill="#000000"
          size={10}
          className="mr-10"
        />
        {t("Bientôt disponible", "Bientôt disponible")}
      </TimeContainer>
    </div>
  </div>
)
}
export default StructureCard;
