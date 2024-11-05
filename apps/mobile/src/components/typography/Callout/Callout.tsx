import { View } from "react-native";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks";
import { Card, Columns, Rows, RowsSpacing, Spacer } from "../../layout";
import { TextDSFR_L_Bold } from "../../StyledText";

interface Props {
  key?: string;
  children: any;
}

const Callout = (props: Props) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();

  return (
    <View key={props.key}>
      <Spacer key={props.key + "_spacer"} height={theme.margin * 3} />
      <Card key={props.key} backgroundColor="transparent">
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
              {props.children}
            </Rows>
          </View>
        </Columns>
      </Card>
      <Spacer key={props.key + "_spacer_"} height={theme.margin * 3} />
    </View>
  );
};

export default Callout;
