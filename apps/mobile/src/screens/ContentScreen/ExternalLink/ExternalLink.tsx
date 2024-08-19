import React, { memo, useCallback } from "react";
import { Linking, View } from "react-native";
import { Id } from "@refugies-info/api-types";
import { CustomButton } from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import { styles } from "../../../theme";
import { logEventInFirebase } from "../../../utils/logEvent";
import { FirebaseEvent } from "../../../utils/eventsUsedInFirebase";

interface Props {
  externalLink: string | undefined;
  contentId: Id | undefined;
  backgroundColor: string;
}

const ExternalLinkComponent = (props: Props) => {
  const { t } = useTranslationWithRTL();

  const handleClick = useCallback(() => {
    if (!props.contentId) return;
    logEventInFirebase(FirebaseEvent.CLIC_SEE_WEBSITE, {
      contentId: props.contentId.toString(),
    });
    if (!props.externalLink) return;
    const url = !props.externalLink.includes("https://")
      ? "https://" + props.externalLink
      : props.externalLink;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }, [props.contentId, props.externalLink]);

  if (!props.externalLink) return null;
  return (
    <View
      style={{
        marginTop: -(styles.margin * 2),
        marginBottom: styles.margin * 5,
      }}
    >
      <CustomButton
        textColor={styles.colors.white}
        i18nKey="content_screen.go_website_button"
        onPress={handleClick}
        defaultText="Voir le site"
        backgroundColor={props.backgroundColor}
        iconName="external-link-outline"
        accessibilityLabel={t("content_screen.go_website_accessibility")}
      />
    </View>
  );
};

export const ExternalLink = memo(ExternalLinkComponent);
