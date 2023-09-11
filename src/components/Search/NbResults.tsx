import React from "react";
import styled from "styled-components/native";
import { TextNormalBold } from "../StyledText";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const StyledTextBold = styled(TextNormalBold)`
  margin-top: ${styles.margin * 5}px;
  margin-bottom: ${styles.margin * 3}px;
  padding-horizontal: ${styles.margin * 3}px;
`;

interface Props {
  nbResults: number;
}

const NbResults = (props: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <StyledTextBold>
      {t("search_screen.results", "résultats", { nbResults: props.nbResults })}
    </StyledTextBold>
  );
};

export default NbResults;
