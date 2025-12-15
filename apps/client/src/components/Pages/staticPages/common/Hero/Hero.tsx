import Button from "@codegouvfr/react-dsfr/Button";
import Image from "next/image";
import React from "react";
import { Section } from "~/components/Pages/staticPages/common/Section";

interface Props {
  title: string;
  subtitle: string;
  buttonTitle: string;
  image: any;
  imageWidth: number;
}

export const Hero = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => (
  <Section ref={ref} className="bg-action-high-blue-france">
    <div className="container">
      <div className="flex flex-col gap-10 md:flex-row md:items-center lg:gap-20">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-h1 text-inverted-blue-france md:text-alt-title mb-6">
            {props.title}
          </h1>
          <p className="text-chapo text-inverted-blue-france mb-0">{props.subtitle}</p>
          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className="fr-button-reverse max-md:text-large mt-10 w-full justify-center max-md:min-h-[48px] md:w-auto"
            linkProps={{
              href: "#register",
            }}
          >
            {props.buttonTitle}
          </Button>
        </div>
        <div className="flex-1">
          <Image
            src={props.image}
            alt=""
            width={props.imageWidth}
            className="mx-auto h-auto max-w-full"
          />
        </div>
      </div>
    </div>
  </Section>
));

Hero.displayName = "Hero";
