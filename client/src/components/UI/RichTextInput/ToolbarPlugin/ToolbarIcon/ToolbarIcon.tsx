import Image from "next/image";

interface Props {
  name: string;
  className?: string;
}

const ToolbarIcon = (props: Props) => {
  return <Image src={`/icons/editor/${props.name}.svg`} width={16} height={16} alt="" className={props.className} />;
};

export default ToolbarIcon;
