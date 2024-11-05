import React from "react";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Icon, ReadableText, Spacer } from "~/components";
import { useTranslationWithRTL } from "~/hooks";
import { getSelectedLanguageFromI18nCode } from "~/libs/language";
import { currentI18nCodeSelector, selectedContentSelector } from "~/services";

const NoticeView = styled.View`
  background-color: #e8edff;
  padding: ${({ theme }) => theme.margin * 2}px;
  margin-top: -${({ theme }) => theme.margin * 3}px;
  margin-bottom: ${({ theme }) => theme.margin * 3}px;
  margin-left: -${({ theme }) => theme.margin * 3}px;
  margin-right: -${({ theme }) => theme.margin * 3}px;
  border-top-left-radius: ${({ theme }) => theme.margin}px;
  border-top-right-radius: ${({ theme }) => theme.margin}px;
`;

const NoticeContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const NoticeText = styled.Text`
  font-size: ${({ theme }) => theme.margin * 2}px;
  font-weight: 700;
  color: #0063cb;
  flex-shrink: 1;
`;
const CloseButton = styled(TouchableOpacity)`
  width: ${({ theme }) => theme.margin * 4}px;
  height: ${({ theme }) => theme.margin * 4}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LanguageUnavailable = () => {
  const { t } = useTranslationWithRTL();
  const currentLanguageCode = useSelector(currentI18nCodeSelector);
  const [localeMessageHidden, setLocaleMessageHidden] = React.useState(false);
  const selectedContent = useSelector(selectedContentSelector(currentLanguageCode));
  const currentLanguage = getSelectedLanguageFromI18nCode(currentLanguageCode);

  if (
    !currentLanguageCode ||
    !selectedContent ||
    localeMessageHidden ||
    selectedContent.availableLanguages.includes(currentLanguageCode)
  )
    return null;

  return (
    <NoticeView>
      <NoticeContent>
        <Icon name="info" color="#0063CB" size={24} />
        <Spacer width={16} />
        <NoticeText>
          <ReadableText>
            {t("content_screen.languageUnavailable", {
              language: currentLanguage?.langueLoc?.toLowerCase() || "",
            })}
          </ReadableText>
        </NoticeText>
        <Spacer width={16} />
        <CloseButton
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={t("global.close")}
          onPress={() => setLocaleMessageHidden(true)}
        >
          <Icon name="close-outline" color="#0063CB" size={16} />
        </CloseButton>
      </NoticeContent>
    </NoticeView>
  );
};

export default LanguageUnavailable;
