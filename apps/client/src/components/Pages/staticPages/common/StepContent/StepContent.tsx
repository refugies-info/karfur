import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import React, { useMemo } from "react";
import Image from "~/components/UI/Image";
import { useSanitizedContent } from "~/hooks";
import { useWindowSize } from "@refugies-info/ui";
import { cls } from "~/lib/classname";

interface Props {
  step: number;
  title: string;
  texts: (string | React.ReactNode | string[])[];
  cta?: {
    text: string;
    link: string;
  };
  image?: any;
  dottedLine?: boolean;
  width?: number;
  buttonStep?: string;
  buttonStepEnd?: boolean;
  badge?: string;
}

const StepContent = (props: Props) => {
  const { isTablet } = useWindowSize();

  const buttonStep = useMemo(
    () => (
      <div
        className={cls(
          "text-large bg-artwork-minor-blue-france z-10 rounded-full p-4 text-center font-bold text-white",
          "absolute start-0 bottom-[60px] lg:bottom-[120px] lg:-translate-x-1/2 lg:rtl:translate-x-1/2",
          props.buttonStepEnd && "!bottom-0",
        )}
      >
        {props.buttonStep}
      </div>
    ),
    [props.buttonStep, props.buttonStepEnd],
  );

  const safeTitle = useSanitizedContent(props.title);

  return (
    <div
      className={cls("align-stretch relative flex flex-col-reverse justify-between ps-4 lg:flex-row lg:gap-30 lg:ps-0")}
    >
      <div
        className={cls(
          "border-artwork-minor-blue-france relative order-2 max-w-none border-s-4 ps-8 pb-9 lg:min-h-[420px] lg:ps-[80px] lg:pb-26",
          props.dottedLine && "border-dashed",
          !!props.buttonStep && "!pb-0 lg:!pb-[250px]",
        )}
      >
        <div
          className={cls(
            "absolute -start-[1rem] top-0 h-8 w-8 lg:-start-[1.375rem] lg:h-10 lg:w-10",
            "text-h5 lg:text-h4 bg-artwork-minor-blue-france rounded-full font-bold text-white",
            "flex items-center justify-center",
          )}
        >
          <span className={cls("h-4 leading-[1rem] lg:h-[1.375rem] lg:leading-[1.25rem]")}>{props.step}</span>
        </div>
        <h3
          className={cls("text-h4 lg:text-h3", props.badge ? "mb-3" : "mb-6")}
          dangerouslySetInnerHTML={{
            __html: safeTitle,
          }}
        ></h3>
        {props.badge && (
          <Badge small severity="info" noIcon className="mb-6">
            {props.badge}
          </Badge>
        )}
        {props.texts.map((text, i) =>
          Array.isArray(text) ? (
            <div key={i} className="bg-contrast-beige-gris-galet border-default-grey mb-6 border p-4">
              <ul className="my-0 space-y-2">
                {text.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p key={i} className="text-large mb-6">
              {text}
            </p>
          ),
        )}
        {props.cta && (
          <Button
            priority="tertiary"
            size="large"
            linkProps={{ href: props.cta.link }}
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
          >
            {props.cta.text}
          </Button>
        )}
        {!isTablet && props.buttonStep && buttonStep}

        {/* fade border */}
        {props.dottedLine && (
          <span
            className={cls(
              "hidden lg:block",
              "from-beige/0 to-beige absolute -start-1 bottom-0 h-[200px] w-1 bg-gradient-to-b",
            )}
          ></span>
        )}
      </div>

      <div
        className={cls(
          "relative order-1 flex w-auto shrink-0 items-start justify-center lg:w-[480px]",
          "border-artwork-minor-blue-france border-s-4 ps-8 pb-[60px] lg:border-none lg:ps-0 lg:pb-0",
          props.dottedLine && "border-dashed",
          !!props.buttonStep && "pb-[150px] lg:pb-0",
        )}
      >
        {props.image && <Image src={props.image} alt="" width={props.width || 550} style={{ objectFit: "contain" }} />}
        {/* fade border */}
        {props.dottedLine && (
          <span
            className={cls(
              "lg:hidden",
              "from-beige/0 to-beige absolute -start-1 bottom-0 h-[200px] w-1 bg-gradient-to-b",
            )}
          ></span>
        )}
      </div>
      {isTablet && props.buttonStep && buttonStep}
    </div>
  );
};

export default StepContent;
