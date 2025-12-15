import { cn } from "~/lib/classname";

interface Props {
  children: string;
  className?: string;
  smallMb?: boolean;
}

export const Title2 = (props: Props) => (
  <h2
    className={cn(
      "text-h3 md:text-h2 md:text-center",
      props.smallMb ? "mb-6" : "mb-10 md:mb-20",
      props.className,
    )}
  >
    {props.children}
  </h2>
);
