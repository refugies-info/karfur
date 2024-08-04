import * as Tooltip from "@radix-ui/react-tooltip";
import { operatorsPerDepartment } from "data/agirOperators";
import { cls } from "lib/classname";
import React, { SVGAttributes, useMemo, useState } from "react";
import styles from "./Department.module.scss";

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

interface Props {
  dep: string;
  points?: string;
  d?: string;
  fillRule?: SVGAttributes<SVGElement>["fillRule"];
}

const Department: React.FC<React.PropsWithChildren<Props>> = ({ dep, d, points }) => {
  const [activeDep, setActiveDep] = useState("");

  const isSelectable = useMemo(() => selectableDepartments.includes(dep), [dep]);

  const props = useMemo(() => {
    return {
      id: `dpt-${dep}`,
      onClick: () => (isSelectable ? setActiveDep((d) => (d === dep ? "" : dep)) : {}),
      fill: MAP_COLORS[dep] || undefined,
      className: cls(styles.dep, isSelectable && styles.selectable, dep === activeDep && styles.selected),
    };
  }, [isSelectable, dep, activeDep]);

  const mapElement = points ? (
    <polygon points={points} {...props}></polygon>
  ) : d ? (
    <path d={d} {...props}></path>
  ) : null;

  return isSelectable ? (
    mapElement
  ) : (
    <Tooltip.Root>
      <Tooltip.Portal>
        <Tooltip.TooltipContent className={styles.tooltip}>
          Ce territoire n'a pas encore d'opérateur AGIR notifié
        </Tooltip.TooltipContent>
      </Tooltip.Portal>

      <Tooltip.Trigger asChild>{mapElement}</Tooltip.Trigger>
    </Tooltip.Root>
  );
};

export default Department;
