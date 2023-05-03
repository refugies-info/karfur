import React from "react";
import { GetDispositifResponse } from "@refugies-info/api-types";
import styled from "styled-components/native";
import {
  Button,
  Card,
  Columns,
  IconButton,
  Rows,
  SectionTitle,
  TextNormal,
} from "../../../../components";

import Background from "./Background";
import { View } from "react-native";
import { addMerci, deleteMerci } from "../../../../utils/API";
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
  const [{ loading: loadingMerci }, merci] = useAsyncFn(
    () =>
      addMerci(dispositif._id.toString()).then(() => {
        dispatch(
          setSelectedContentActionCreator({
            content: {
              ...dispositif,
              merci: [...dispositif.merci, { created_at: new Date() }],
            },
            locale: currentLanguage,
          })
        );
      }),
    [
      addMerci,
      currentLanguage,
      dispatch,
      setSelectedContentActionCreator,
      dispositif,
    ]
  );
  const [{ loading: loadingNonMerci }, nonMerci] = useAsyncFn(
    () =>
      deleteMerci(dispositif._id.toString()).then(() => {
        dispatch(
          setSelectedContentActionCreator({
            content: {
              ...dispositif,
              merci: dispositif.merci.slice(1),
            },
            locale: currentLanguage,
          })
        );
      }),
    [
      deleteMerci,
      currentLanguage,
      dispatch,
      setSelectedContentActionCreator,
      dispositif,
    ]
  );

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
                color="#000091"
                iconName="thumb_up"
                loading={loadingMerci}
                onPress={merci}
                title={t("content_screen.nbThanks", {
                  count: dispositif.merci.length,
                })}
              />
              <IconButton
                accessibilityLabel="Dire non merci"
                color="#000091"
                iconName="thumb_down"
                loading={loadingNonMerci}
                onPress={nonMerci}
                outlined
              />
            </Columns>
          </View>
        </Rows>
      </MercisView>
    </Card>
  );
};

export default Mercis;
