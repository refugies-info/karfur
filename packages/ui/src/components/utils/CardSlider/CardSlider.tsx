import { cn } from "@/lib/cn";

type CardSliderProps = {
  children: React.ReactNode;
  translateX?: number;
  className?: string;
  title?: string;
};
function CardSlider({ children, translateX = 0, className }: CardSliderProps) {
  return (
    // <div className={cn("container", className)} style={{ transform: `translateX(${translateX}px)` }}>
    <div className={cn("container", className)}>
      <div className="flex w-fit gap-4">{children}</div>
    </div>
  );
}

CardSlider.displayName = "CardSlider";

export { CardSlider };
