import { useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export function useHeaderAnimation(offset = 10) {
  const [showSimplifiedHeader, setShowSimplifiedHeader] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y > offset && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (contentOffset.y < offset && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
  };

  return { handleScroll, showSimplifiedHeader };
}
