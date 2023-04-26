import React from "react";
import { GetDispositifResponse } from "@refugies-info/api-types";
import styled, { useTheme } from "styled-components/native";
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
  const _theme = useTheme();
  const dispatch = useDispatch();
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
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "flex-start",
          }}
        >
          <View style={{ minHeight: "40%" }}>
            <Background />
          </View>
          <MySectionTitle>Ces informations sont utiles ?</MySectionTitle>
          <MyTextNormal>
            Remerciez les contributeurs qui l'ont rédigée et traduite pour vous
            !
          </MyTextNormal>
          <View>
            <Columns layout="auto" horizontalAlign="center">
              <Button
                accessibilityLabel="Dire merci"
                color="#000091"
                iconName="thumb_up"
                loading={loadingMerci}
                onPress={merci}
                title={`${dispositif.merci.length} merci${
                  dispositif.merci.length > 1 ? "s" : ""
                }`}
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
        </View>
      </MercisView>
    </Card>
  );
};

export default Mercis;
