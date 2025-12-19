import { useMemo } from "react";
import { cls } from "~/lib/classname";

interface Props {
  value: number;
  color: string;
  className?: string;
  small?: boolean;
}

export const Progress = (props: Props) => {
  const value = useMemo(() => Math.floor(props.value), [props.value]);
  return (
    <div
      className={cls(
        "flex rounded-md bg-gray-200 overflow-hidden",
        props.small ? "h-3" : "h-4",
        props.className,
      )}
    >
      <div
        className={props.color}
        role="progressbar"
        aria-label="translation progress"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
