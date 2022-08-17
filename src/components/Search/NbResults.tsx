import React from "react";
import styled from "styled-components/native";
import { connectStats } from "react-instantsearch-native";
import { TextNormalBold } from "../StyledText";
import { styles } from "../../theme"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const StyledTextBold = styled(TextNormalBold)`
  margin-top: ${styles.margin * 5}px;
  margin-bottom: ${styles.margin * 3}px;
  padding-horizontal: ${styles.margin * 3}px;
`;

interface Props {
  nbHits: number;
}

const NbResults = ({ nbHits }: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <StyledTextBold>
      {t("search_screen.results", "résultats", { nbResults: nbHits })}
    </StyledTextBold>
  )
}

export default connectStats(NbResults);