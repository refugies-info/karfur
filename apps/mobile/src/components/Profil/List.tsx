import { View } from "react-native";
import styled from "styled-components/native";
import { styles } from "~/theme";
import { RTLView } from "../BasicComponents";
import { TextDSFR_MD } from "../StyledText";

const BulletPoint = styled(TextDSFR_MD)<{ isRTL: boolean }>`
  margin-right: ${({ isRTL }) => (isRTL ? styles.margin / 2 : 0)}px;
  margin-left: ${({ isRTL }) => (!isRTL ? styles.margin / 2 : 0)}px;
`;
const ListItem = styled(TextDSFR_MD)<{ isRTL: boolean }>`
  margin-right: ${({ isRTL }) => (isRTL ? styles.margin : 0)}px;
  margin-left: ${({ isRTL }) => (!isRTL ? styles.margin : 0)}px;
  flex-shrink: 1;
`;

interface Props {
  items: (string | any)[];
  isRTL: boolean;
  style?: any;
}

export const List = (props: Props) => (
  <View style={props.style || {}}>
    {props.items.map((item, index) =>
      item ? (
        <RTLView key={index} style={{ alignItems: "flex-start" }}>
          <BulletPoint isRTL={props.isRTL}>{"\u2022"}</BulletPoint>
          <ListItem isRTL={props.isRTL}>{item}</ListItem>
        </RTLView>
      ) : null,
    )}
  </View>
);
