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
      "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm",
      props.active
        ? "bg-action-high-blue-france text-white"
        : "bg-action-low-blue-france text-title-blue-france hover:bg-open-blue-france",
    )}
  >
    {props.children}
    {props.active && <i className="fr-icon-checkbox-circle-fill fr-icon--sm" aria-hidden="true" />}
  </button>
);
