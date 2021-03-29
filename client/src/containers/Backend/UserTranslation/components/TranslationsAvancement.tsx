/* eslint-disable no-console */
import React from "react";
import { Language, IDispositifTranslation } from "../../../../types/interface";
import styled from "styled-components";
import { LanguageTitle } from "./SubComponents";
import { TranslationAvancementTable } from "./TranslationAvancementTable";

interface Props {
  userTradLanguages: Language[];
  history: any;
  actualLanguage: string;
  isExpert: boolean;
  data: IDispositifTranslation[];
}

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  //   justify-content: space-between;
  align-items: center;
`;

const MainContainer = styled.div`
  margin: 30px 100px 30px 100px;
`;
export const TranslationsAvancement = (props: Props) => {
  const navigateToLanguage = (langue: string) => {
    if (props.actualLanguage !== langue) {
      return props.history.push("/backend/user-translation/" + langue);
    }
    return;
  };

  return (
    <MainContainer>
      <RowContainer>
        {props.userTradLanguages.map((langue) => (
          <div
            key={langue.i18nCode}
            onClick={() => navigateToLanguage(langue.i18nCode)}
          >
            <LanguageTitle
              language={langue}
              isSelected={langue.i18nCode === props.actualLanguage}
              hasMultipleLanguages={props.userTradLanguages.length > 1}
            />
          </div>
        ))}
      </RowContainer>
      <TranslationAvancementTable isExpert={props.isExpert} data={props.data} />
    </MainContainer>
  );
};
