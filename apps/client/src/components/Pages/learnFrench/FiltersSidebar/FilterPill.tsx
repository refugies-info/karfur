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
      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
        <i
          className="fr-icon-check-line fr-icon--xs text-action-high-blue-france"
          aria-hidden="true"
        />
      </span>
    )}
  </button>
);
