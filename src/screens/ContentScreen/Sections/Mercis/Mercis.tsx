import React, { useEffect, useMemo, useState } from "react";
import { GetDispositifResponse } from "@refugies-info/api-types";
import styled from "styled-components/native";
import {
  Button,
  Card,
  Columns,
  Rows,
  SectionTitle,
  TextNormal,
} from "../../../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Background from "./Background";
import { View } from "react-native";
import { addMerci } from "../../../../utils/API";
import { setSelectedContentActionCreator } from "../../../../services/redux/SelectedContent/selectedContent.actions";
import { useDispatch, useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../../../services";
import useAsyncFn from "react-use/lib/useAsyncFn";
import { useTranslationWithRTL } from "../../../../hooks";

const MercisView = styled.View`
  padding: ${({ theme }) => theme.margin * 2}px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MySectionTitle = styled(SectionTitle)`
  text-align: center;
`;

const MyTextNormal = styled(TextNormal)`
  text-align: center;
  margin-horizontal: ${({ theme }) => theme.margin * 2}px;
`;

export interface MercisProps {
  dispositif: GetDispositifResponse;
}

const Mercis = ({ dispositif }: MercisProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRTL();
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

  const [{ loading: loadingMerci }, merci] = useAsyncFn(() => {
    if (hasThanked || loadingMerci) return Promise.resolve();
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
        <Rows layout="1">
          <Background />
          <MySectionTitle>{t("content_screen.feedbackTitle")}</MySectionTitle>
          <MyTextNormal>{t("content_screen.feedbackSubtitle")}</MyTextNormal>
          <View>
            <Columns layout="auto" horizontalAlign="center">
              <Button
                accessibilityLabel="Dire merci"
                color={hasThanked ? "#fff" : "#000091"}
                iconColor={hasThanked ? "#fff" : "#000091"}
                backgroundColor={hasThanked ? "#000091" : undefined}
                iconName="thumb_up"
                loading={loadingMerci}
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
