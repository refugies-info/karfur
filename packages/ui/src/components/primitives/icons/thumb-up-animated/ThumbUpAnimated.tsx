/* eslint-disable @typescript-eslint/no-explicit-any */
import { DotLottieReact, type DotLottieReactProps } from "@lottiefiles/dotlottie-react";
import { cn } from "@refugies-info/ui";
import { forwardRef, useImperativeHandle, useState } from "react";

import ThumbUpAnimation from "./assets/thumb-up.lottie";

interface ThumbUpAnimatedProps extends DotLottieReactProps {
  className?: string;
  themeId?: "light" | "Default";
}

export interface ThumbUpAnimatedRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setFrame: (frameNumber: number) => void;
  goToLastFrame: () => void;
  totalFrames: number;
}

export const ThumbUpAnimated = forwardRef<ThumbUpAnimatedRef, ThumbUpAnimatedProps>(
  ({ className, themeId = "Default", ...props }, ref) => {
    // State to hold the dotLottie instance
    const [dotLottieInstance, setDotLottieInstance] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    // Create an imperative handle to expose methods to the parent component
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (isReady && dotLottieInstance) {
            dotLottieInstance.play();
          }
        },
        pause: () => isReady && dotLottieInstance?.pause(),
        stop: () => isReady && dotLottieInstance?.stop(),
        setFrame: (frameNumber: number) => {
          if (isReady && dotLottieInstance) {
            try {
              dotLottieInstance.stop();
              dotLottieInstance.setFrame(frameNumber);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Error setting frame:", error);
            }
          }
        },

        goToLastFrame: () => {
          if (isReady && dotLottieInstance) {
            dotLottieInstance.stop();
            dotLottieInstance.setFrame(dotLottieInstance.totalFrames - 1);
          }
        },
        totalFrames: 29,
      }),
      [dotLottieInstance, isReady],
    );

    // Callback to get the dotLottie instance
    const dotLottieRefCallback = (dotLottie: any) => {
      if (dotLottie) {
        setDotLottieInstance(dotLottie);
        // Set a small timeout to ensure the animation is fully loaded
        setTimeout(() => {
          setIsReady(true);
        }, 300);
      }
    };

    return (
      <div className={cn("aspect-[33_/_49] h-auto w-[1.5rem]", className)} aria-hidden="true">
        <DotLottieReact
          src={ThumbUpAnimation}
          autoplay={false}
          loop={false}
          mode="forward"
          themeId={themeId}
          dotLottieRefCallback={dotLottieRefCallback}
          {...props}
        />
      </div>
    );
  },
);

ThumbUpAnimated.displayName = "ThumbUpAnimated";
