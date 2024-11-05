import { useWindowDimensions, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { styles } from "~/theme";

interface TabBarIconProps {
  color: string;
  focused: boolean;
  iconName: string;
  badge?: boolean;
  isSmall?: boolean;
}

const ICON_SIZE = 24;
const ICON_SIZE_SMALL = 18;

export const TabBarIcon = (props: TabBarIconProps) => {
  const { fontScale } = useWindowDimensions();
  const iconNameWithFocus = props.focused ? props.iconName : props.iconName + "-outline";

  // TODO Généraliser dans l'application ?
  const scale = Math.max(fontScale / 1.7, 1);
  return (
    <>
      <Icon
        name={iconNameWithFocus}
        width={!props.isSmall ? ICON_SIZE * scale : ICON_SIZE_SMALL * scale}
        height={!props.isSmall ? ICON_SIZE * scale : ICON_SIZE_SMALL * scale}
        fill={props.color}
      />
      {props.badge && (
        <View
          style={{
            width: styles.margin,
            height: styles.margin,
            position: "absolute",
            top: 2,
            left: "50%",
            marginLeft: 10,
            backgroundColor: styles.colors.darkBlue,
            borderRadius: styles.margin / 2,
          }}
        ></View>
      )}
    </>
  );
};
