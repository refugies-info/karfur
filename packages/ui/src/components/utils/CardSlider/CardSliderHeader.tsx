import { CardSliderNavigation } from "@/components/utils";
import { cn } from "@/lib/cn";

type CardSliderHeaderProps = {
  className?: string;
  children?: React.ReactNode;
  withNavigation?: boolean;
};
function CardSliderHeader({ className, children, withNavigation = true }: CardSliderHeaderProps) {
  return (
    <div className={cn("container flex w-full justify-between", className)}>
      {children}
      {withNavigation && <CardSliderNavigation />}
    </div>
  );
}

CardSliderHeader.displayName = "CardSliderHeader";

export { CardSliderHeader };
