import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BackgroundStructure from "assets/comment-contribuer/CommentContribuer-background_violet.svg";
import { assetsOnServer } from "assets/assetsOnServer";
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
const StructureCardContainer = styled.div`
  background-image: url(${BackgroundStructure});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: not-allowed;
  position: relative;
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

}

const StructureCard = (props: Props) => {
  const { t } = useTranslation();

return (
  <StructureCardContainer>
    <img src={assetsOnServer.commentContribuer.structure} alt="structure" />
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
          size="10"
          className="mr-10"
        />
        {t("Bientôt disponible", "Bientôt disponible")}
      </TimeContainer>
    </div>
  </StructureCardContainer>
)
}
export default StructureCard;
