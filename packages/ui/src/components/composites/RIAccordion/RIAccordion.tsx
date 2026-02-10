import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { cn } from "../../../lib/cn";

export interface RIAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean, e: React.MouseEvent<Element, MouseEvent>) => void;
  stepNumber?: number;
}

export const RIAccordion = (props: RIAccordionProps) => {
  const {
    title,
    children,
    className,
    id,
    defaultExpanded,
    expanded,
    onExpandedChange,
    stepNumber,
  } = props;
  return (
    <Accordion
      {...(props as any)}
      label={
        <div className="flex w-full items-center justify-between">
          <span className="inline-flex items-start gap-2 leading-[1.75rem]">
            {!!stepNumber && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full pt-1">
                <span className="bg-action-high-blue-france flex h-6 w-6 items-center justify-center rounded-full p-[0.41669rem] text-white md:p-0.5">
                  {stepNumber}
                </span>
              </span>
            )}
            {title}
          </span>
          <span className="flex items-center">
            <i className="ri-add-fill scale-75" />
            <i className="ri-subtract-fill scale-75" />
          </span>
        </div>
      }
      className={cn(
        // Base styles
        "max-md:[&_h3_button]:text-lg",
        "[&_h3_button]:text-title-grey",
        // Hide default DSFR arrow
        "[&_h3_button]:after:hidden",
        // Logic to show/hide custom icons based on aria-expanded
        "[&_h3_button[aria-expanded='true']_.ri-add-fill]:hidden",
        "[&_h3_button[aria-expanded='false']_.ri-subtract-fill]:hidden",
        // Layout overrides
        "[&_h3_button]:grid-cols-[1fr] [&_h3_button]:items-start [&_h3_button]:justify-between [&_h3_button]:gap-1 md:[&_h3_button]:grid",
        "[&_h3]:!mb-0",
        // Force first child of content to have no top margin to align with accordion padding
        "[&_.fr-collapse_>_*:first-child]:mt-0",
        "rtl:[&_h3_button]:text-right",
        className,
      )}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      {children ?? <></>}
    </Accordion>
  );
};

RIAccordion.displayName = "RIAccordion";
