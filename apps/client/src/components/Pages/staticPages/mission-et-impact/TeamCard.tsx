import Tag from "@codegouvfr/react-dsfr/Tag";
import Image, { StaticImageData } from "next/image";
import { cls } from "~/lib/classname";

interface Props {
  name: string;
  position: string;
  tag: string;
  link: string;
  image: StaticImageData;
}

export const TeamCard = (props: Props) => {
  return (
    <div className={cls("fr-card fr-enlarge-link fr-card--horizontal", "w-full sm:w-[478px] flex-row")}>
      <div className={cls("fr-card__body", "px-0")}>
        <div
          className={cls(
            "fr-card__content",
            "px-4 pt-4 pb-[52px] sm:px-6 sm:pt-6 sm:pb-[68px] mx-0 max-h-[196px] sm:max-h-none",
          )}
        >
          <h3 className={cls("fr-card__title", "text-large sm:text-chapo")}>
            <a href={props.link} target="_blank" rel="noreferrer" className="fr-default">
              {props.name}
            </a>
          </h3>
          <p className={cls("fr-card__desc", "line-clamp-2 mt-2")}>{props.position}</p>
          <div className={cls("fr-card__start", "h-6 mb-4")}>
            <Tag small>{props.tag}</Tag>
          </div>
        </div>
        <i className="fr-icon-arrow-right-line absolute right-4 bottom-4 sm:right-6 sm:bottom-6 before:w-4 before:h-4 text-blue-france" />
      </div>
      <div className={cls("fr-card__header", "w-[160px] h-[196px] sm:w-[220px] sm:h-[220px] flex-none")}>
        <div className={cls("fr-card__img", "h-full")}>
          <Image
            src={props.image}
            alt={`${props.name} - ${props.position}`}
            className={cls("fr-responsive-img", "h-full object-cover")}
          />
        </div>
      </div>
    </div>
  );
};
