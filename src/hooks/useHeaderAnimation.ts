import * as React from "react";

export function useHeaderAnimation() {
  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 5 && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 5 && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return { handleScroll, showSimplifiedHeader }
}
