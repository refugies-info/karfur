import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BackgroundLexique from "assets/comment-contribuer/CommentContribuer-background_bleu.svg";
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
const LexiqueCardContainer = styled.div`
  background-image: url(${BackgroundLexique});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;
  padding-top: 10px;
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

const LexiqueCard = (props: Props) => {
  const { t } = useTranslation();

  return (
  <LexiqueCardContainer>
    <img src={assetsOnServer.commentContribuer.lexique} alt="lexique" />
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
          {t("CommentContribuer.Ajouter un mot au", "Ajouter un mot au")}
        </TitleContainer>
        <TitleFramed width={"97px"}>
          {t("CommentContribuer.Lexique", "Lexique")}
        </TitleFramed>
        <DescriptionText>
          {t(
            "CommentContribuer.LexiqueDescription",
            "Expliquez les mots difficiles de l’administration et de l’intégration pour faciliter la compréhension pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>

      <TimeContainer>
        <EVAIcon
          name="calendar-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {t("CommentContribuer.Prochainement", "Prochainement")}
      </TimeContainer>
    </div>
  </LexiqueCardContainer>
)
}

export default LexiqueCard;
