import { cn } from "@/lib/cn";

type CardSliderWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

function CardSliderWrapper({ children, className }: CardSliderWrapperProps) {
  return <section className={cn("w-full overflow-hidden", className)}>{children}</section>;
}

CardSliderWrapper.displayName = "CardSliderWrapper";

export { CardSliderWrapper };
