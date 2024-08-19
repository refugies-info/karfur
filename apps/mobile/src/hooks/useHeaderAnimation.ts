import { useState } from "react";

export function useHeaderAnimation(offset = 10) {
  const [showSimplifiedHeader, setShowSimplifiedHeader] = useState(false);

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > offset && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < offset && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return { handleScroll, showSimplifiedHeader };
}
