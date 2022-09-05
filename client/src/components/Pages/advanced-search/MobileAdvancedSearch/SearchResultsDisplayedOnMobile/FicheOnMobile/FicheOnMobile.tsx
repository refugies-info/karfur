import React from "react";
import { IDispositif } from "types/interface";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { colors } from "colors";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import ThemeIcon from "components/UI/ThemeIcon";

interface Props {
  dispositif: IDispositif;
}
interface ItemContainerProps {
  typeContenu: "demarche" | "dispositif"
  darkColor: string
  lightColor: string
}
const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: ${(props: ItemContainerProps) =>
    props.typeContenu === "demarche" ? `2px solid ${props.darkColor}` : null};
  min-height: 76px;
  margin: 13px 0;
  background-color: ${(props: ItemContainerProps) =>
    props.typeContenu === "dispositif" ? colors.gray10 : props.lightColor};
  border-radius: 12px;
  align-items: center;
  padding: 16px;
`;

const TitleText = styled.div`
  color: ${(props: {color: string}) => props.color};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
`;

const SubTitleText = styled.div`
  font-size: 16px;
  font-weight: normal;
`;

const PictoCircle = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  align-items: center;
  min-width: 44px;
  height: 44px;
  background-color: ${(props: {color: string}) => props.color}; ;
`;

export const FicheOnMobile = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);

  const navigateToContent = () => {
    const route = props.dispositif.typeContenu === "demarche" ? "/demarche/[id]" : "/dispositif/[id]";
    return router.push({
      pathname: getPath(route, router.locale),
      query: {id: props.dispositif._id.toString() || ""}
    });
  };
  return (
    <div>
      {props.dispositif.theme && (
        <ItemContainer
          darkColor={props.dispositif.theme.colors.color100}
          typeContenu={props.dispositif.typeContenu}
          lightColor={props.dispositif.theme.colors.color30}
          onClick={navigateToContent}
        >
          <TitleText color={props.dispositif.theme.colors.color100}>
            {props.dispositif.titreInformatif}
            {props.dispositif.titreMarque && (
              <SubTitleText>
                {" " + t("Dispositif.avec", "avec") + " "}{" "}
                {props.dispositif.titreMarque}
              </SubTitleText>
            )}
          </TitleText>

          <PictoCircle color={props.dispositif.theme.colors.color100}>
            <ThemeIcon theme={props.dispositif.theme} />
          </PictoCircle>
        </ItemContainer>
      )}
    </div>
  );
};
