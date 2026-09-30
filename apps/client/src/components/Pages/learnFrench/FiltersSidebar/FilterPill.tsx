import type { ReactNode } from "react";
import { cls } from "~/lib/classname";

interface Props {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const FilterPill = (props: Props) => (
  <button
    type="button"
    onClick={props.onClick}
    className={cls(
      "relative inline-flex items-center rounded-full px-4 py-2 text-sm",
      props.active
        ? "bg-action-high-blue-france text-white"
        : "bg-action-low-blue-france text-title-blue-france hover:bg-open-blue-france",
    )}
  >
    {props.children}
    {props.active && (
      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white">
        <span className="border-action-high-blue-france flex h-3.5 w-3.5 items-center justify-center rounded-full border-2">
          <i
            className="fr-icon-check-line fr-icon--xs text-action-high-blue-france"
            aria-hidden="true"
          />
        </span>
      </span>
    )}
  </button>
);
