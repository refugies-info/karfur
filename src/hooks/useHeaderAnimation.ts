import { useState } from "react";

export function useHeaderAnimation() {
  const [showSimplifiedHeader, setShowSimplifiedHeader] = useState(false);

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 10 && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 10 && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return { handleScroll, showSimplifiedHeader };
}
