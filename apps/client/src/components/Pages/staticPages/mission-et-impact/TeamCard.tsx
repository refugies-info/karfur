import Tag from "@codegouvfr/react-dsfr/Tag";
import Image, { type StaticImageData } from "next/image";
import { cn } from "~/lib/classname";

interface Props {
  name: string;
  position: string;
  tag: string;
  link: string;
  image: StaticImageData;
}

export const TeamCard = (props: Props) => {
  return (
    <div className={cn("fr-card fr-enlarge-link fr-card--horizontal", "flex-row")}>
      <div className={cn("fr-card__body", "px-0")}>
        <div
          className={cn(
            "fr-card__content",
            "mx-0 min-h-[12.25rem] px-4 pt-4 pb-4 sm:max-h-none sm:px-6 sm:pt-6",
          )}
        >
          <div className={cn("", "mb-4 h-6")}>
            <Tag small>{props.tag}</Tag>
          </div>
          <h3 className={cn("fr-card__title", "text-large sm:text-[1.25rem]")}>
            <a href={props.link} target="_blank" rel="noreferrer" className="fr-default">
              {props.name}
            </a>
          </h3>
          <p className={cn("fr-card__desc", "mt-2")}>{props.position}</p>
          <i
            aria-hidden={true}
            className="fr-icon-arrow-right-line text-title-blue-france relative order-last mt-auto flex justify-end before:h-4 before:w-4"
          />
        </div>
      </div>
      <div
        className={cn("fr-card__header", "min-h-[12.25rem] w-[10rem] flex-none lg:w-[14.6rem]")}
        aria-hidden={true}
      >
        <div className={cn("fr-card__img", "h-full")}>
          <Image
            src={props.image}
            alt=""
            className={cn("fr-responsive-img", "h-full object-cover")}
          />
        </div>
      </div>
    </div>
  );
};
