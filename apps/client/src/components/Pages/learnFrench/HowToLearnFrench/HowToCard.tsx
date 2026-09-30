import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "~/components/UI/Image";

interface Props {
  icon: StaticImageData;
  tagKey: string;
  title: string;
  description: string;
  href: string;
}

export const HowToCard = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Link
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-default-grey hover:bg-alt-blue-france relative flex w-[260px] shrink-0 snap-start flex-col items-center border bg-white pt-8 lg:w-auto lg:flex-1 lg:shrink"
    >
      <span
        className="bg-action-high-blue-france absolute -right-px -bottom-1 -left-px h-1"
        aria-hidden="true"
      />
      <div className="flex w-full flex-col items-center px-6 pb-4">
        <Image src={props.icon} alt="" width={80} height={80} />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-between px-8 pb-8">
        <div className="flex flex-col items-center gap-3">
          <span className="bg-contrast-purple-glycine text-label-purple-glycine w-fit rounded px-2 text-sm leading-6 font-bold whitespace-nowrap uppercase">
            {t(props.tagKey, props.tagKey)}
          </span>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-title-blue-france text-h6 mb-0 font-bold">{props.title}</p>
            <p className="text-default-grey mb-0">{props.description}</p>
          </div>
        </div>
        <i
          className="fr-icon-arrow-right-line text-title-blue-france mt-4 self-end"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
};
