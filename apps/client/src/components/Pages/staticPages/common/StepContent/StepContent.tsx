import Button from "@codegouvfr/react-dsfr/Button";
import { useMemo } from "react";
import Image from "~/components/UI/Image";
import { useSanitizedContent } from "~/hooks";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";

interface Props {
  step: number;
  title: string;
  texts: (string | string[])[];
  cta?: {
    text: string;
    link: string;
  };
  image?: any;
  dottedLine?: boolean;
  width?: number;
  buttonStep?: string;
  buttonStepEnd?: boolean;
}

const StepContent = (props: Props) => {
  const { isTablet } = useWindowSize();

  const buttonStep = useMemo(
    () => (
      <div
        className={cls(
          "text-large p-4 text-white rounded-full font-bold text-center z-10 bg-purple-france",
          "absolute start-0 bottom-[60px] lg:bottom-[120px] lg:-translate-x-1/2 lg:rtl:translate-x-1/2",
          props.buttonStepEnd && "bottom-0",
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
      className={cls("flex flex-col-reverse lg:flex-row lg:gap-30 align-stretch justify-between ps-4 lg:ps-0 relative")}
    >
      <div
        className={cls(
          "ps-8 lg:ps-[80px] pb-9 lg:pb-26 lg:min-h-[420px] max-w-none order-2 border-s-4 relative border-purple-france",
          props.dottedLine && "border-dashed",
          !!props.buttonStep && "!pb-0 lg:!pb-[250px]",
        )}
      >
        <div
          className={cls(
            "w-8 h-8 lg:w-10 lg:h-10 absolute top-0 -start-[16px] lg:-start-[22px]",
            "text-h5 lg:text-h4 text-white font-bold rounded-full bg-purple-france",
            "flex items-center justify-center",
          )}
        >
          <span className={cls("h-4 leading-[15px] lg:h-[22px] lg:leading-[20px]")}>{props.step}</span>
        </div>
        <h3
          className="text-h4 lg:text-h3 mb-6"
          dangerouslySetInnerHTML={{
            __html: safeTitle,
          }}
        ></h3>
        {props.texts.map((text, i) =>
          Array.isArray(text) ? (
            <div key={i} className="bg-beige-accent border border-border p-4 mb-6">
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
              "w-1 absolute h-[200px] bottom-0 -start-1 bg-gradient-to-b from-beige/0 to-beige",
            )}
          ></span>
        )}
      </div>

      <div
        className={cls(
          "relative flex items-start justify-center order-1 shrink-0 w-auto lg:w-[480px]",
          "border-s-4 border-purple-france lg:border-none ps-8 lg:ps-0 pb-[60px] lg:pb-0",
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
              "w-1 absolute h-[200px] bottom-0 -start-1 bg-gradient-to-b from-beige/0 to-beige",
            )}
          ></span>
        )}
      </div>
      {isTablet && props.buttonStep && buttonStep}
    </div>
  );
};

export default StepContent;
