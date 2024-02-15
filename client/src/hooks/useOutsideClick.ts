import React, { useEffect } from "react";

const useOutsideClick = (ref: React.MutableRefObject<Element | undefined | null>, callback: () => void) => {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains((e.target as Element))) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
