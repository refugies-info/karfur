import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { TextDSFR_L_Bold } from "../StyledText";

const StyledTextBold = styled(TextDSFR_L_Bold)`
  margin-top: ${styles.margin * 5}px;
  margin-bottom: ${styles.margin * 3}px;
  padding-horizontal: ${styles.margin * 3}px;
`;

interface Props {
  nbResults: number;
}

const NbResults = (props: Props) => {
  const { t } = useTranslationWithRTL();

  return <StyledTextBold>{t("search_screen.results", "résultats", { nbResults: props.nbResults })}</StyledTextBold>;
};

export default NbResults;
