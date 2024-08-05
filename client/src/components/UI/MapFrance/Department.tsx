import * as Tooltip from "@radix-ui/react-tooltip";
import { operatorsPerDepartment } from "data/agirOperators";
import { cls } from "lib/classname";
import React, { SVGAttributes, useContext, useMemo, useState } from "react";
import styles from "./Department.module.scss";
import { MapContext } from "./MapContext";

const selectableDepartments = Object.keys(operatorsPerDepartment);

const normalizeColors = (colors: Record<string, string[]>) => {
  const normalizedColors: Record<string, string> = {};
  for (const [color, depts] of Object.entries(colors)) {
    for (const dept of depts) {
      normalizedColors[dept] = color;
    }
  }
  return normalizedColors;
};

const MAP_COLORS = normalizeColors({
  "#313278": selectableDepartments,
});

type Props = {
  dep: string;
} & (
  | {
      d?: string;
      points?: never;
      fillRule?: never;
    }
  | {
      d?: never;
      points?: string;
      fillRule?: SVGAttributes<SVGElement>["fillRule"];
    }
);

const Department: React.FC<Props> = ({ dep, d, points }) => {
  const { selectedDepartment, setSelectedDepartment } = useContext(MapContext);

  const isSelectable = useMemo(() => selectableDepartments.includes(dep), [dep]);

  const props = useMemo(() => {
    return {
      id: `dpt-${dep}`,
      onClick: () => {
        if (isSelectable && setSelectedDepartment) {
          setSelectedDepartment(dep);
        }
      },
      fill: MAP_COLORS[dep] || undefined,
      className: cls(styles.dep, isSelectable && styles.selectable, dep === selectedDepartment && styles.selected),
    };
  }, [isSelectable, dep, selectedDepartment, setSelectedDepartment]);

  // Manage open state so that the tooltip can be opened
  // when clicking on a map element without flashing
  const [open, setOpen] = useState(false);

  const mapElement = points ? (
    <polygon
      points={points}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        setOpen(true);
      }}
      onMouseOut={(e) => setOpen(false)}
    ></polygon>
  ) : d ? (
    <path
      d={d}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        setOpen(true);
      }}
      onMouseOut={() => setOpen(false)}
    ></path>
  ) : null;

  return isSelectable ? (
    mapElement
  ) : (
    <Tooltip.Root
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
      }}
    >
      <Tooltip.Portal>
        <Tooltip.TooltipContent
          className={styles.tooltip}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          Ce territoire n'a pas encore d'opérateur AGIR notifié
        </Tooltip.TooltipContent>
      </Tooltip.Portal>

      <Tooltip.Trigger asChild>{mapElement}</Tooltip.Trigger>
    </Tooltip.Root>
  );
};

export default Department;
