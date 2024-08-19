import React, { useEffect, useMemo, useState } from "react";
import { GetDispositifResponse } from "@refugies-info/api-types";
import styled, { useTheme } from "styled-components/native";
import {
  Button,
  Card,
  Columns,
  Rows,
  RowsSpacing,
  SectionTitle,
  TextDSFR_MD,
} from "../../../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Background from "./Background";
import { View } from "react-native";
import { addMerci, deleteMerci } from "../../../../utils/API";
import { setSelectedContentActionCreator } from "../../../../services/redux/SelectedContent/selectedContent.actions";
import { useDispatch, useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../../../services";
import useAsyncFn from "react-use/lib/useAsyncFn";
import { useTranslationWithRTL } from "../../../../hooks";
import { styles } from "../../../../theme";

const MercisView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MySectionTitle = styled(SectionTitle)`
  text-align: center;
  margin-top: ${({ theme }) => theme.margin * 2}px;
`;

const MyTextNormal = styled(TextDSFR_MD)`
  text-align: center;
  margin-horizontal: ${({ theme }) => theme.margin * 2}px;
`;

export interface MercisProps {
  dispositif: GetDispositifResponse;
}

const Mercis = ({ dispositif }: MercisProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRTL();
  const theme = useTheme();
  const currentLanguage = useSelector(currentI18nCodeSelector) || "fr";

  const [thanks, setThanks] = useState<string[]>([]);
  const hasThanked = useMemo(
    () => thanks.includes(dispositif._id.toString()),
    [thanks, dispositif._id]
  );

  useEffect(() => {
    AsyncStorage.getItem("THANKS").then((thanks) =>
      setThanks((thanks || "")?.split(","))
    );
  }, []);

  const [state, merci] = useAsyncFn(async () => {
    if (hasThanked) {
      return deleteMerci(dispositif._id.toString()).then(() => {
        const newThanks = thanks.filter((d) => d !== dispositif._id.toString());
        setThanks(newThanks);
        AsyncStorage.setItem("THANKS", newThanks.join(","));
        const newDispositifThanks = JSON.parse(
          JSON.stringify(dispositif.merci)
        );
        newDispositifThanks.pop();

        dispatch(
          setSelectedContentActionCreator({
            content: {
              ...dispositif,
              merci: newDispositifThanks,
            },
            locale: currentLanguage,
          })
        );
      });
    }
    return addMerci(dispositif._id.toString()).then(() => {
      const newThanks = [...thanks, dispositif._id.toString()];
      setThanks(newThanks);
      AsyncStorage.setItem("THANKS", newThanks.join(","));
      dispatch(
        setSelectedContentActionCreator({
          content: {
            ...dispositif,
            merci: [...dispositif.merci, { created_at: new Date() }],
          },
          locale: currentLanguage,
        })
      );
    });
  }, [
    addMerci,
    deleteMerci,
    currentLanguage,
    dispatch,
    setSelectedContentActionCreator,
    dispositif,
    thanks,
    hasThanked,
  ]);

  return (
    <Card backgroundColor="#E3E3FD">
      <MercisView>
        <Rows layout="1" spacing={RowsSpacing.NoSpace}>
          <Background />
          <MySectionTitle>{t("content_screen.feedbackTitle")}</MySectionTitle>
          <MyTextNormal>{t("content_screen.feedbackSubtitle")}</MyTextNormal>
          <View
            style={{
              paddingHorizontal: styles.margin,
              paddingVertical: styles.margin * 2,
            }}
          >
            <Columns layout="auto" horizontalAlign="center">
              <Button
                accessibilityLabel="Dire merci"
                color={
                  hasThanked ? theme.colors.white : theme.colors.dsfr_action
                }
                iconColor={
                  hasThanked ? theme.colors.white : theme.colors.dsfr_action
                }
                backgroundColor={
                  hasThanked ? theme.colors.dsfr_action : undefined
                }
                iconName="thumb_up"
                loading={state.loading}
                onPress={merci}
                title={t("content_screen.nbThanks", {
                  count: dispositif.merci.length,
                })}
              />
            </Columns>
          </View>
        </Rows>
      </MercisView>
    </Card>
  );
};

export default Mercis;
