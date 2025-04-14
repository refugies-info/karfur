/* eslint-disable @typescript-eslint/no-explicit-any */
import { DotLottieReact, DotLottieReactProps } from "@lottiefiles/dotlottie-react";
import { cn } from "@refugies-info/ui";
import { forwardRef, useImperativeHandle, useState } from "react";

import ThumbUpAnimation from "./assets/thumb-up.lottie";

interface ThumbUpAnimatedProps extends DotLottieReactProps {
  className?: string;
}

export interface ThumbUpAnimatedRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setFrame: (frameNumber: number) => void;
}

export const ThumbUpAnimated = forwardRef<ThumbUpAnimatedRef, ThumbUpAnimatedProps>(({ className, ...props }, ref) => {
  // State to hold the dotLottie instance
  const [dotLottieInstance, setDotLottieInstance] = useState<any>(null);

  // Create an imperative handle to expose methods to the parent component
  useImperativeHandle(
    ref,
    () => ({
      play: () => dotLottieInstance?.play(),
      pause: () => dotLottieInstance?.pause(),
      stop: () => dotLottieInstance?.stop(),
      setFrame: (frameNumber: number) => dotLottieInstance?.setFrame(frameNumber),
    }),
    [dotLottieInstance],
  );

  // Callback to get the dotLottie instance
  const dotLottieRefCallback = (dotLottie: any) => {
    setDotLottieInstance(dotLottie);
  };

  return (
    <div className={cn("aspect-[33_/_49] h-auto w-[1.5rem]", className)}>
      <DotLottieReact
        src={ThumbUpAnimation}
        autoplay={false}
        loop={false}
        mode="forward"
        dotLottieRefCallback={dotLottieRefCallback}
        {...props}
      />
    </div>
  );
});

ThumbUpAnimated.displayName = "ThumbUpAnimated";
