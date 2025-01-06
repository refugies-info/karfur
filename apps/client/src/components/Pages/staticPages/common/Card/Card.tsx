import { ReactElement } from "react";
import Image from "~/components/UI/Image";

interface Props {
  title: string;
  children: any;
  image?: any;
  header?: ReactElement;
  footer?: ReactElement;
}

const Card = (props: Props) => {
  return (
    <div className="p-6 md:p-8 flex-1 border border-border">
      <div>
        {props.header}
        {props.image && <Image src={props.image} alt="" width={80} height={80} style={{ objectFit: "contain" }} />}
      </div>
      <h3 className="!text-h6 md:!text-h5 !my-3 !text-blue-france">{props.title}</h3>
      <div className="!text-large">{props.children}</div>
      <div>{props.footer}</div>
    </div>
  );
};

export default Card;
