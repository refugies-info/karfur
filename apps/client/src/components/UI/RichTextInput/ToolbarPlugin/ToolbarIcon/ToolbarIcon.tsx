import { cls } from "@/lib/classname";

interface Props {
  name: string;
  className?: string;
}

const ToolbarIcon = (props: Props) => {
  return <i className={cls(props.name, props.className)} />;
};

export default ToolbarIcon;
