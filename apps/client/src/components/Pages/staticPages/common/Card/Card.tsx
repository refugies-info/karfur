import Link from "next/link";
import { type ReactElement, useMemo } from "react";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";

interface Props {
  title: string;
  children: any;
  className?: string;
  image?: any;
  imageWidth?: number;
  imageHeight?: number;
  imageComponent?: ReactElement;
  header?: ReactElement;
  footer?: ReactElement;
  footerBottom?: boolean;
  link?: string;
  onClick?: () => void;
}

const CARD_CLASSNAME =
  "lg:max-w-[22.5rem] p-6 md:p-8 flex-1 flex flex-col justify-between border border-default-grey text-left bg-white";
const CARD_HOVER_CLASSNAME = "hover:bg-background-alt-grey active:bg-active-tint";

const ArrowRight = () => (
  <div className="mt-6 w-full pt-2 text-right">
    <i className="fr-icon-arrow-right-line text-title-blue-france" />
  </div>
);

const Card = (props: Props) => {
  const content = useMemo(
    () => (
      <div className="flex h-full flex-col">
        <div>
          {props.header}
          {props.image && (
            <Image
              src={props.image}
              alt=""
              width={props.imageWidth || 80}
              height={props.imageHeight || 80}
              style={{ objectFit: "contain" }}
            />
          )}
          {props.imageComponent}
        </div>
        <h3 className="text-h6 md:text-h5 text-title-blue-france my-3">{props.title}</h3>
        <div className={cls("[&_p]:text-large", props.footerBottom && "flex-grow")}>
          {props.children}
        </div>
        {props.footer && <div>{props.footer}</div>}
      </div>
    ),
    [
      props.title,
      props.children,
      props.image,
      props.header,
      props.footer,
      props.footerBottom,
      props.imageWidth,
      props.imageHeight,
      props.imageComponent,
    ],
  );

  if (props.link) {
    return (
      <Link
        href={props.link}
        className={cls(CARD_CLASSNAME, CARD_HOVER_CLASSNAME, props.className, "block")}
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
      <button
        className={cls(CARD_CLASSNAME, CARD_HOVER_CLASSNAME, props.className)}
        onClick={props.onClick}
        title={props.title}
      >
        {content}
        <ArrowRight />
      </button>
    );
  }

  return <div className={cls(CARD_CLASSNAME, props.className)}>{content}</div>;
};

export default Card;
