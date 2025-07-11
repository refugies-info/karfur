import { useCallback, useState } from "react";
import useBoolean from "react-use/lib/useBoolean";

const useStateOnce = <T>(defaultValue?: T) => {
  const [setted, toggleSetted] = useBoolean(false);
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const setter = useCallback(
    (newValue: T) => {
      if (!setted) {
        setValue(newValue);
        toggleSetted();
      }
    },
    [value],
  );
  return [value, setter];
};

export default useStateOnce;
