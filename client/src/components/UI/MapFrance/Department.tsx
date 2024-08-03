import * as Tooltip from "@radix-ui/react-tooltip";
import React, { SVGAttributes } from "react";
import styles from "./Department.module.scss";

interface Props {
  id: string;
  fill: string | undefined;
  className?: string;
  onClick?: () => void;
  points?: string;
  d?: string;
  fillRule?: SVGAttributes<SVGElement>["fillRule"];
}

const Department: React.FC<React.PropsWithChildren<Props>> = ({ d, points, ...props }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Portal>
        <Tooltip.TooltipContent className={styles.tooltip}>
          Ce territoire n'a pas encore d'opérateur AGIR notifié
        </Tooltip.TooltipContent>
      </Tooltip.Portal>

      <Tooltip.Trigger asChild>
        {points ? <polygon points={points} {...props}></polygon> : d ? <path d={d} {...props}></path> : null}
      </Tooltip.Trigger>
    </Tooltip.Root>
  );
};

export default Department;
