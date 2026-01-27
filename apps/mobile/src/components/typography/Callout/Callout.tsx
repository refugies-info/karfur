import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks";
import { Icon } from "../../iconography";
import { Card, Columns, Rows, RowsSpacing, Spacer } from "../../layout";
import { TextDSFR_L_Bold } from "../../StyledText";

interface Props {
  variant?: "info" | "important";
}

const Callout = ({ variant = "info", children }: PropsWithChildren<Props>) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();

  if (variant === "important") {
    return (
      <View>
        <Spacer height={theme.margin * 3} />
        <Card backgroundColor={theme.colors.lightGrey}>
          <Columns layout="auto 1">
            <View style={{ backgroundColor: "#6A6AF4", flexGrow: 1 }}>
              {/* @ts-ignore - Icon path issue likely but visual is correct */}
              <Icon name="warning" size={40} color="white" />
            </View>
            <View style={{ padding: 10 }}>
              <Rows spacing={RowsSpacing.Text}>
                <TextDSFR_L_Bold>
                  {t("content_screen.callout_important", "Important")}
                </TextDSFR_L_Bold>
                {children}
              </Rows>
            </View>
          </Columns>
        </Card>
        <Spacer height={theme.margin * 3} />
      </View>
    );
  }

  return (
    <View>
      <Spacer height={theme.margin * 3} />
      <Card backgroundColor="transparent">
        <Columns layout="auto 1">
          <View
            style={{
              marginLeft: theme.margin,
              marginRight: theme.margin * 2,
              borderRadius: 2,
              backgroundColor: theme.colors.dsfr_purple,
              flexGrow: 1,
              width: theme.margin / 2,
            }}
          />
          <View>
            <Rows spacing={RowsSpacing.Text}>
              <TextDSFR_L_Bold style={{ color: theme.colors.dsfr_purple }}>
                {t("content_screen.callout_info", "Bon à savoir")}
              </TextDSFR_L_Bold>
              {children}
            </Rows>
          </View>
        </Columns>
      </Card>
      <Spacer height={theme.margin * 3} />
    </View>
  );
};

export default Callout;
