import Button from "@codegouvfr/react-dsfr/Button";
import Image, { type StaticImageData } from "next/image";
import React from "react";
import { Section } from "~/components/Pages/staticPages/common/Section";

interface Props {
  title: string;
  subtitle: string;
  searchCtaText: string;
  searchCtaHref: string;
  learnMoreCtaText: string;
  learnMoreCtaHref: string;
  rcoDisclaimer: string;
  rcoLinkText: string;
  rcoLinkHref: string;
  image: StaticImageData;
}

export const Hero = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => {
  return (
    <Section ref={ref} className="bg-[linear-gradient(120deg,#c5d0fc_4.7%,#e3fdeb_126.1%)] md:pb-0">
      <div className="container">
        <div className="flex flex-col gap-10 md:flex-row md:items-center lg:gap-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-h1 md:text-alt-title mb-6">{props.title}</h1>
            <p className="text-chapo text-default-grey mb-10">{props.subtitle}</p>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <Button
                iconId="fr-icon-search-line"
                iconPosition="left"
                linkProps={{ href: props.searchCtaHref }}
              >
                {props.searchCtaText}
              </Button>
              <Button
                priority="secondary"
                iconId="fr-icon-compass-3-line"
                iconPosition="left"
                linkProps={{ href: props.learnMoreCtaHref }}
              >
                {props.learnMoreCtaText}
              </Button>
            </div>
            <p className="mt-10 text-sm text-[#2f4077]">
              {props.rcoDisclaimer}{" "}
              <a
                href={props.rcoLinkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {props.rcoLinkText}
              </a>
            </p>
          </div>
          <div className="order-first flex-1 md:order-none">
            <Image src={props.image} alt="" className="mx-auto h-auto max-w-full" />
          </div>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
