import type { User } from "types/interface";
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import SVGIcon from "components/UI/SVGIcon/SVGIcon";
import BackgroundDispositif from "assets/comment-contribuer/CommentContribuer-background_orange.svg";
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
const DispoCardContainer = styled.div`
  background-image: url(${BackgroundDispositif});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;
  border: 4px solid #ffffff;
  cursor: pointer;
  &:hover {
    border: 4px solid #f9aa75;
  }
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
  user: User | null
  toggleModal: any
}

const DispositifCard = (props: Props) => {
  const { t } = useTranslation();

  return (
  <DispoCardContainer
    onClick={() => {
      if (!props.user) {
        return props.history.push("/login");
      }
      if (props.user.email !== "") {
        return props.history.push("/dispositif");
      }
      return props.toggleModal("dispositif");
    }}
  >
    <img src={assetsOnServer.commentContribuer.dispositif} alt="dispositif" />
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
          size="10"
          className="mr-10"
        />
        {"~ 20 "}
        {t("CommentContribuer.minutes", "minutes")}
      </TimeContainer>
    </div>
  </DispoCardContainer>
  )
}

export default DispositifCard;
