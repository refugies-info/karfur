import House from "./House";
import Menu from "./Menu";
import Message from "./Message";
import Search from "./Search";
import Tag from "./Tag";

type iconName = "house" | "search" | "message" | "menu" | "tag" | "";
interface Props {
  name?: iconName;
  stroke?: string;
  width?: number;
  height?: number;
}

const Streamline = (props: Props) => {
  switch (props.name) {
    case "search":
      return <Search {...props} />;
    case "message":
      return <Message {...props} />;
    case "menu":
      return <Menu {...props} />;
    case "tag":
      return <Tag {...props} />;
    default:
      return <House {...props} />;
  }
};

export default Streamline;
