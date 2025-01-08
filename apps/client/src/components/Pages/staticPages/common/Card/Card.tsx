import Link from "next/link";
import { ReactElement, useMemo } from "react";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";

interface Props {
  title: string;
  children: any;
  image?: any;
  header?: ReactElement;
  footer?: ReactElement;
  link?: string;
  onClick?: () => void;
}

const CARD_CLASSNAME = "p-6 md:p-8 flex-1 flex flex-col justify-between !border !border-border text-left";
const CARD_HOVER_CLASSNAME = "hover:!bg-hover active:!bg-active";

const ArrowRight = () => (
  <div className="mt-6 pt-2 w-full text-right">
    <i className="fr-icon-arrow-right-line !text-blue-france" />
  </div>
);

const Card = (props: Props) => {
  const content = useMemo(
    () => (
      <div>
        <div>
          {props.header}
          {props.image && <Image src={props.image} alt="" width={80} height={80} style={{ objectFit: "contain" }} />}
        </div>
        <h3 className="!text-h6 md:!text-h5 !my-3 !text-blue-france">{props.title}</h3>
        <div className="!text-large">{props.children}</div>
        {props.footer && <div>{props.footer}</div>}
      </div>
    ),
    [props.title, props.children, props.image, props.header, props.footer],
  );

  if (props.link) {
    return (
      <Link
        href={props.link}
        className={cls(CARD_CLASSNAME, CARD_HOVER_CLASSNAME, "block")}
        title={props.title}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
        <ArrowRight />
      </Link>
    );
  }

  if (props.onClick) {
    return (
      <button className={cls(CARD_CLASSNAME, CARD_HOVER_CLASSNAME)} onClick={props.onClick} title={props.title}>
        {content}
        <ArrowRight />
      </button>
    );
  }

  return <div className={CARD_CLASSNAME}>{content}</div>;
};

export default Card;
