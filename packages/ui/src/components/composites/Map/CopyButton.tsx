import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";

export const CopyButton = ({ onClick, title }: { onClick: () => void; title: string }) => {
  return (
    <Tooltip title={title} kind="hover">
      <Button
        size="small"
        title={title}
        aria-label={title}
        onClick={onClick}
        priority="tertiary"
        className="aspect-square p-2"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.66653 4.00065V2.00065C4.66653 1.63246 4.96501 1.33398 5.3332 1.33398H13.3332C13.7014 1.33398 13.9999 1.63246 13.9999 2.00065V11.334C13.9999 11.7022 13.7014 12.0007 13.3332 12.0007H11.3332V14.0001C11.3332 14.3686 11.0333 14.6673 10.662 14.6673H2.67111C2.30039 14.6673 2 14.3709 2 14.0001L2.00173 4.6679C2.0018 4.29939 2.30176 4.00065 2.67295 4.00065H4.66653ZM3.33495 5.33398L3.33346 13.334H9.99987V5.33398H3.33495ZM5.99987 4.00065H11.3332V10.6673H12.6665V2.66732H5.99987V4.00065Z"
            fill="#000091"
          />
        </svg>
      </Button>
    </Tooltip>
  );
};
