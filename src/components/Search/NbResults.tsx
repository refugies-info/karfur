import React from "react";
import styled from "styled-components/native";
import { connectStats } from "react-instantsearch-native";
import { TextNormalBold } from "../StyledText";
import { theme } from "../../theme"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const StyledTextBold = styled(TextNormalBold)`
  margin-top: ${theme.margin * 5}px;
  margin-bottom: ${theme.margin * 3}px;
  padding-horizontal: ${theme.margin * 3}px;
`;

interface Props {
  nbHits: number;
}

const NbResults = ({ nbHits }: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <StyledTextBold>
      {t("SearchScreen.résultats", "résultats", { nbResults: nbHits })}
    </StyledTextBold>
  )
}

export default connectStats(NbResults);