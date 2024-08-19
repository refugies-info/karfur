import { View } from "react-native";
import { withProps } from "../../../utils";

const RadioGroup = withProps({ accessibilityRole: "radiogroup" })(View);
export default RadioGroup;
